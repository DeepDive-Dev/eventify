"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { checkoutOrder } from "@/lib/actions/order.actions";

interface Message {
  type: "user" | "bot";
  content: string | JSX.Element;
  isRich?: boolean;
}

interface ChatbotProps {
  userId: string;
}

const Chatbot = ({ userId }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [awaitingEventName, setAwaitingEventName] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  console.log("Chatbot userId:", userId);

  const knowledgeBase = {
    "event metrics":
      "Key event metrics to track include: attendance rate, participant engagement, session popularity, feedback sentiment, social media mentions, networking effectiveness, and ROI.",
    "event highlights":
      "Please provide the name of the event for which you would like detailed highlights, or request 'Display all events' to view a complete list.",
    "all events": "Retrieving the full list of events... Please wait.",
    default:
      "I am your Event Analytics Assistant, powered by Gemini AI. I can provide event summaries, perform sentiment analysis, generate posters, or answer custom queries like 'description of an event'. Try requesting 'Display all events' or 'What is the price of test'.",
    unknown:
      "I do not have sufficient information on that request. Please try 'Display all events' to view available events or ask something like 'description of test'.",
  };

  const initialSuggestedQuestions = [
    { display: "Provide event highlights", action: "provide event highlights" },
    { display: "Display all events", action: "display all events" },
    { display: "Summarize an event", action: "summarize an event" },
  ];

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([{ type: "bot", content: knowledgeBase.default }]);
      addQuickOptions(initialSuggestedQuestions);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  const addMessage = (type: "user" | "bot", content: string | JSX.Element) => {
    setMessages((prev) => [...prev, { type, content }]);
  };

  const addRichMessage = (content: string | JSX.Element) => {
    setMessages((prev) => [...prev, { type: "bot", content, isRich: true }]);
  };

  const showTypingIndicator = () => setIsTyping(true);
  const hideTypingIndicator = () => setIsTyping(false);
  const showGeminiLoading = () => setIsGeminiLoading(true);
  const hideGeminiLoading = () => setIsGeminiLoading(false);

  const addQuickOptions = (options: { display: string; action: string }[]) => {
    const optionsHTML = `
      <div class="flex flex-wrap gap-2">
        ${options
          .map(
            (opt) =>
              `<button class="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md" onclick="window.dispatchEvent(new CustomEvent('sendMessage', { detail: '${opt.action}' }))">${opt.display}</button>`
          )
          .join("")}
      </div>
    `;
    addRichMessage(optionsHTML);
  };

  const fetchAllEvents = async () => {
    try {
      const response = await fetch("/api/chatbot/events", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Fetch all events error:", error);
      return [];
    }
  };

  const fetchEventDetails = async (eventName: string) => {
    try {
      const response = await fetch(
        `/api/chatbot/events?query=${encodeURIComponent(eventName)}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error(`Failed to fetch event: ${eventName}`);
      const events = await response.json();
      return events.length > 0 ? [events[0]] : [];
    } catch (error) {
      console.error("Fetch event details error:", error);
      return null;
    }
  };

  const fetchGeminiResponse = async (message: string) => {
    try {
      const response = await fetch("/api/chatbot/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Failed to fetch Gemini response");
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Gemini API error:", error);
      return "Sorry, I couldn't process that request due to an error.";
    }
  };

  const handleCheckout = async (event: any) => {
    console.log("handleCheckout called for event:", event._id);
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price || "0",
      isFree: event.isFree,
      buyerId: userId,
    };
    console.log("Order data:", order);
    try {
      const response = await checkoutOrder(order);
      console.log("Checkout response:", response);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const displayEventDetails = (event: any) => {
    const eventDetails = (
      <div>
        <h4 className="text-xl font-bold text-indigo-600">{event.title}</h4>
        <div className="mt-3 bg-gray-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm">
            <strong className="text-gray-700">Date:</strong>{" "}
            {new Date(event.startDateTime).toLocaleString()} -{" "}
            {new Date(event.endDateTime).toLocaleString()}
          </p>
          <p className="text-sm">
            <strong className="text-gray-700">Location:</strong>{" "}
            {event.location || "Not specified"}
          </p>
          <p className="text-sm">
            <strong className="text-gray-700">Description:</strong>{" "}
            {event.description || "No description available"}
          </p>
          <p className="text-sm">
            <strong className="text-gray-700">Price:</strong>{" "}
            {event.isFree ? "Free" : event.price || "Not specified"}
          </p>
          {event.url && (
            <p className="text-sm">
              <strong className="text-gray-700">URL:</strong>{" "}
              <a
                href={event.url}
                target="_blank"
                className="text-indigo-500 hover:underline break-all max-w-full inline-block"
              >
                {event.url}
              </a>
            </p>
          )}
          <p className="text-sm">
            <strong className="text-gray-700">Category:</strong>{" "}
            {event.category?.name || "Not specified"}
          </p>
          <p className="text-sm">
            <strong className="text-gray-700">Organizer:</strong>{" "}
            {event.organizer
              ? `${event.organizer.firstName} ${event.organizer.lastName}`
              : "Not specified"}
          </p>
        </div>
        <div className="mt-4">
          <h5 className="text-md font-semibold text-gray-800">Event Image</h5>
          <div className="flex gap-3 flex-wrap mt-2">
            <div>
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-28 h-28 object-cover rounded-md shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  const lightbox = document.createElement("div");
                  lightbox.className =
                    "fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50";
                  lightbox.innerHTML = `
                    <div class="absolute top-5 right-5 text-white text-3xl cursor-pointer hover:text-gray-300 transition-colors" onclick="this.parentElement.remove()">×</div>
                    <img src="${event.imageUrl}" alt="Enlarged event photo" class="max-w-[90%] max-h-[90%] rounded-lg shadow-lg">
                  `;
                  document.body.appendChild(lightbox);
                  lightbox.addEventListener(
                    "click",
                    (ev) => ev.target === lightbox && lightbox.remove()
                  );
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Click to enlarge</p>
          <button
            className="mt-3 px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-md"
            onClick={() => {
              console.log("Buy button clicked for event:", event._id);
              handleCheckout(event);
            }}
          >
            {event.isFree ? "Get Ticket" : "Buy Ticket"}
          </button>
        </div>
      </div>
    );
    addRichMessage(eventDetails);
  };

  const processAllEventsRequest = async () => {
    addMessage("bot", "Retrieving the full list of events... Please wait.");
    showTypingIndicator();
    const events = await fetchAllEvents();
    hideTypingIndicator();
    
    if (events && events.length > 0) {
      events.forEach((event: any) => displayEventDetails(event));
      const filteredOptions = initialSuggestedQuestions.filter(
        (q) => q.action !== "display all events"
      );
      filteredOptions.push({
        display: "Which event do you want to continue with?",
        action: "which event do you want to continue with?",
      });
      addQuickOptions(filteredOptions);
    } else {
      addMessage(
        "bot",
        "No events were found. Please check if events are available in the database or try again later."
      );
      addQuickOptions(initialSuggestedQuestions);
    }
  };

  const processEventSelection = (eventName: string) => {
    setSelectedEvent(eventName);
    addMessage(
      "bot",
      `You have selected "${eventName}". Now I will assist you with this event only.`
    );
    const eventSpecificOptions = [
      {
        display: `Summarize ${eventName}`,
        action: `summarize ${eventName.toLowerCase()}`,
      },
      {
        display: `Provide event highlights for ${eventName}`,
        action: `provide event highlights for ${eventName.toLowerCase()}`,
      },
    ];
    addQuickOptions(eventSpecificOptions);
  };

  const processEventHighlightsRequest = async (eventName: string) => {
    addMessage("bot", `Retrieving details for "${eventName}"... Please wait.`);
    showTypingIndicator();
    const events = await fetchEventDetails(eventName);
    hideTypingIndicator();
    if (events && events.length > 0) {
      displayEventDetails(events[0]);
    } else {
      addMessage(
        "bot",
        `The event "${eventName}" could not be found. Please verify the event name or try 'Display all events' to see available options.`
      );
    }
    setAwaitingEventName(false);
  };

  const processSummarizeRequest = async (eventName: string) => {
    showGeminiLoading();
    const events = await fetchEventDetails(eventName);
    if (events && events.length > 0) {
      const event = events[0];
      const prompt = `Provide a concise summary of the following event: Title: ${
        event.title
      }, Description: ${event.description}, Date: ${new Date(
        event.startDateTime
      ).toLocaleString()} - ${new Date(event.endDateTime).toLocaleString()}`;
      const summary = await fetchGeminiResponse(prompt);
      hideGeminiLoading();
      addMessage("bot", `Summary of "${eventName}": ${summary}`);
    } else {
      hideGeminiLoading();
      addMessage(
        "bot",
        `The event "${eventName}" could not be located for summarization. Please check the event name or use 'Display all events'.`
      );
    }
  };

  const processSentimentRequest = async (eventName: string) => {
    showGeminiLoading();
    const events = await fetchEventDetails(eventName);
    if (events && events.length > 0) {
      const event = events[0];
      const prompt = `Perform a sentiment analysis on the following event description: "${event.description}"`;
      const sentiment = await fetchGeminiResponse(prompt);
      hideGeminiLoading();
      addMessage("bot", `Sentiment analysis for "${eventName}": ${sentiment}`);
    } else {
      hideGeminiLoading();
      addMessage(
        "bot",
        `The event "${eventName}" could not be found for sentiment analysis. Please verify the event name or try 'Display all events' to view available events.`
      );
    }
  };

  const processPosterRequest = async (eventName: string) => {
    showGeminiLoading();
    const events = await fetchEventDetails(eventName);
    if (events && events.length > 0) {
      const event = events[0];
      const prompt = `Generate a concise, creative poster description for an event titled "${
        event.title
      }" with the description "${event.description}" occurring on ${new Date(
        event.startDateTime
      ).toLocaleString()}. Include a compelling tagline and essential details in a single paragraph, formatted for display.`;
      const posterIdea = await fetchGeminiResponse(prompt);
      hideGeminiLoading();

      const posterHTML = `
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
          <h4 class="text-xl font-bold mb-2">${event.title}</h4>
          <p class="text-sm">${posterIdea}</p>
          <p class="mt-2 text-xs italic">Generated by Gemini AI</p>
        </div>
      `;
      addRichMessage(posterHTML);
    } else {
      hideGeminiLoading();
      addMessage(
        "bot",
        `The event "${eventName}" could not be found to generate a poster description. Please check the event name or use 'Display all events'.`
      );
    }
  };

  const processCustomEventQuery = async (query: string) => {
    showGeminiLoading();
    const events = await fetchAllEvents();
    if (events && events.length > 0) {
      const eventData = events.map((event: any) => ({
        title: event.title,
        price: event.isFree ? "Free" : event.price || "Not specified",
        description: event.description || "No description available",
        date: `${new Date(event.startDateTime).toLocaleString()} - ${new Date(event.endDateTime).toLocaleString()}`,
      }));
      const prompt = `Here is a list of events: ${JSON.stringify(eventData)}. Based on this data, answer the following query: "${query}"`;
      const response = await fetchGeminiResponse(prompt);
      hideGeminiLoading();
      addMessage("bot", response);
    } else {
      hideGeminiLoading();
      addMessage(
        "bot",
        "No events were found to process your query. Please try 'Display all events' to check available events."
      );
    }
  };

  const resetChat = () => {
    setMessages([]);
    setSelectedEvent(null);
    setAwaitingEventName(false);
    setInput("");
    setIsTyping(false);
    setIsGeminiLoading(false);
  };

  const processUserMessage = async (message: string) => {
    const normalizedMessage = message.trim().toLowerCase();

    if (awaitingEventName) {
      await processEventHighlightsRequest(message);
      return;
    }

    if (
      normalizedMessage === "display all events" ||
      normalizedMessage === "show all events" ||
      normalizedMessage === "list all events"
    ) {
      await processAllEventsRequest();
      return;
    }

    if (
      normalizedMessage.includes("which event do you want to continue with")
    ) {
      addMessage(
        "bot",
        "Please type the name of the event you want to continue with (e.g., 'test')."
      );
      return;
    }

    if (normalizedMessage === "summarize an event") {
      addMessage(
        "bot",
        "Please provide the name of the event you want to summarize (e.g., 'Summarize test')."
      );
      return;
    }

    if (normalizedMessage.includes("provide event highlights")) {
      const eventName = message.split("for")[1]?.trim();
      if (eventName) {
        await processEventHighlightsRequest(eventName);
      } else {
        setAwaitingEventName(true);
        addMessage("bot", knowledgeBase["event highlights"]);
      }
      return;
    }

    if (normalizedMessage.includes("summarize")) {
      const eventName = message.split("summarize")[1]?.trim();
      if (eventName) {
        await processSummarizeRequest(eventName);
        return;
      }
    }

    if (selectedEvent) {
      const eventLower = selectedEvent.toLowerCase();
      const expectedSummarize = `summarize ${eventLower}`;
      const expectedHighlights = `provide event highlights for ${eventLower}`;

      if (normalizedMessage === expectedSummarize) {
        await processSummarizeRequest(selectedEvent);
      } else if (normalizedMessage === expectedHighlights) {
        await processEventHighlightsRequest(selectedEvent);
      } else {
        addMessage(
          "bot",
          `I'm currently focused on "${selectedEvent}". Please use one of these options:`
        );
        const eventSpecificOptions = [
          {
            display: `Summarize ${selectedEvent}`,
            action: `summarize ${eventLower}`,
          },
          {
            display: `Provide event highlights for ${selectedEvent}`,
            action: `provide event highlights for ${eventLower}`,
          },
        ];
        addQuickOptions(eventSpecificOptions);
      }
      return;
    } else if (
      normalizedMessage === "test" ||
      normalizedMessage.match(/^[a-zA-Z\s]+$/)
    ) {
      const events = await fetchEventDetails(message);
      if (events && events.length > 0) {
        processEventSelection(message);
        return;
      }
    }

    let response = null;
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (normalizedMessage.includes(key)) {
        response = value;
        break;
      }
    }

    if (!response && (normalizedMessage.includes("event") || normalizedMessage.includes("events"))) {
      await processCustomEventQuery(message);
      return;
    }

    response =
      response ||
      (normalizedMessage.match(/hello|hi|hey/)
        ? knowledgeBase.default
        : knowledgeBase.unknown);
    addMessage("bot", response);
    if (
      response === knowledgeBase.unknown ||
      response === knowledgeBase.default
    ) {
      addQuickOptions(initialSuggestedQuestions);
    }
  };

  const handleSend = () => {
    if (input) {
      addMessage("user", input);
      showTypingIndicator();
      processUserMessage(input).then(() => hideTypingIndicator());
      setInput("");
    }
  };

  useEffect(() => {
    const handleCustomSend = (e: CustomEvent) => {
      addMessage("user", e.detail);
      showTypingIndicator();
      processUserMessage(e.detail).then(() => hideTypingIndicator());
    };

    window.addEventListener("sendMessage", handleCustomSend as EventListener);

    return () => {
      window.removeEventListener(
        "sendMessage",
        handleCustomSend as EventListener
      );
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <div
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer z-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      )}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[625px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-xl font-bold tracking-tight">
              Event Analytics Assistant
            </h3>
            <div className="flex items-center gap-3">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-sm text-sm font-medium"
                onClick={resetChat}
              >
                Restart
              </button>
              <button
                className="text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                −
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div key={index} className="mb-3">
                {msg.isRich && typeof msg.content !== "string" ? (
                  <div
                    className={`p-3 rounded-lg max-w-[85%] shadow-md ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white ml-auto"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-lg max-w-[85%] shadow-md ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white ml-auto"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof msg.content === "string" ? msg.content : "",
                    }}
                  />
                )}
              </div>
            ))}
            {isGeminiLoading && (
              <div className="flex justify-center items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping delay-200"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping delay-400"></div>
              </div>
            )}
            {isTyping && !isGeminiLoading && (
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex p-4 border-t border-gray-200 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message here..."
              className="flex-1 p-3 border border-gray-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
            <button
              onClick={handleSend}
              className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-r-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
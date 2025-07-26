import React from 'react'

const ParagraphComponent = () => {
    return (<p className="mt-4 ml-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 px-4 py-3 rounded-r-md">
        Pro tip: For calorie estimates, try asking {" "}
        <a
            href="https://chat.openai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
        >
            ChatGPT
        </a>{" "}
        or{" "}
        <a
            href="https://gemini.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
        >
            Gemini
        </a>.
        <span className="block text-xs text-gray-500 mt-1">
            These third-party tools are not affiliated with this web app.
        </span>
    </p>
    )
}

export default ParagraphComponent
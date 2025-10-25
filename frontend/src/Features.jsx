import React from "react";
import { useNavigate } from "react-router-dom";

const featuresList = [
  { title: "Smart Reminders", desc: "Reminds you before you forget important tasks and events." },
  { title: "Payment & Task Sharing", desc: "Easily split bills and manage shared responsibilities." },
  { title: "Memory Vault", desc: "Stores memories and important notes so you never forget." },
  { title: "Conflict Resolver", desc: "Helps decide when multiple choices conflict." },
  { title: "Task-Centric Design", desc: "Focuses on what must be done, not who you are." },
];

const Features = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (feature) => {
    if (feature.title === "Smart Reminders") {
      navigate("/reminders");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuresList.map((feature, index) => (
          <div
            key={index}
            onClick={() => handleFeatureClick(feature)}
            className="cursor-pointer border border-gray-300 rounded-xl p-5 shadow-md hover:shadow-xl hover:bg-blue-50 transition duration-200"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;

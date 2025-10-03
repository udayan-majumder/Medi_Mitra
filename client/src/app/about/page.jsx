"use client"

import React from 'react';
import { Github, Video, FileText, MapPin, Users, Brain, Mic, Shield, Globe ,ChevronLeft} from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function About() {
const router = useRouter()

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Consultations",
      description: "Connect with qualified doctors through secure WebRTC-powered video calls. Adaptive bitrate streaming ensures smooth consultations even in low-bandwidth rural areas, with audio-only fallback options for connectivity challenges."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Digital Health Records",
      description: "Maintain comprehensive, portable Electronic Health Records (EHR) stored securely on Amazon RDS PostgreSQL. Access your complete medical history anytime, preventing repeated tests and ensuring continuity of care across providers."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Symptom Checker",
      description: "Advanced LLM-based symptom analysis provides personalized health advice and triage recommendations. Our fine-tuned classifier adapts to regional health issues, suggesting local remedies or urgent consultation needs based on your symptoms."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Pharmacy Navigation & Inventory",
      description: "Real-time medicine availability tracking integrated with Google Maps API. Check stock before traveling, get directions to nearby pharmacies, and save time with live inventory updates pushed via REST/webhook endpoints."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Profile Access",
      description: "Single-device family sharing with secure JWT authentication and role-based access control. Multiple family members can maintain separate health profiles on one smartphone, ensuring privacy and convenience for shared devices."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual Support",
      description: "Full support for Punjabi, Hindi, and English interfaces. Breaking language barriers to ensure healthcare accessibility for all literacy levels and linguistic backgrounds across rural India."
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice-Enabled Interface",
      description: "Google Web Speech API integration for speech-to-text and text-to-speech functionality. Empowers elderly and low-literacy users to navigate the platform effortlessly through voice commands and audio feedback."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Scalable Architecture",
      description: "Containerized microservices architecture deployed on Docker and AWS EC2. Enterprise-grade security with encrypted data storage, HIPAA-compliant practices, and scalable infrastructure ready for nationwide expansion."
    }
  ];

  const stats = [
    { value: "20-30 km", label: "Travel Distance Saved" },
    { value: "31%", label: "Rural Internet Coverage" },
    { value: "3", label: "Languages Supported" },
    { value: "100%", label: "Data Security" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 ">
      {/* GitHub Links Section */}
      <div className="bg-green-600 text-white py-4 flex items-center">
        <button className='p-2 cursor-pointer'><ChevronLeft strokeWidth={2} onClick={()=>router.replace("/auth/login")}/></button>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
         
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
             <img src='/logo.png'></img>
            </div>
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 font-medium">
              Your Health Companion
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              A multilingual telemedicine platform bridging the healthcare gap in rural India. 
              Empowering communities with accessible, affordable, and quality healthcare through 
              innovative technology and compassionate care.
            </p>
            <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold">
              🏆 Smart India Hackathon 2025 | Problem Statement SIH25018
            </div>
             <div className="flex flex-wrap items-end justify-center gap-6 h-full p-6">
            <a 
              href="https://github.com/udayan-majumder/Medi_Mitra" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-200 transition-colors bg-green-600 p-2 rounded-[40px]"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">Main Repository</span>
            </a>
            <a 
              href="https://github.com/akhjunaid0047/symptomchecker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-200 transition-colors bg-green-600 p-2 rounded-[40px]"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">Symptom Checker Repository</span>
            </a>
          </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Problem We're Solving</h3>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">•</span>
                  <span>Rural patients traveling 20-30 km for basic consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">•</span>
                  <span>Lost wages from time-consuming healthcare visits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">•</span>
                  <span>Wasted trips to pharmacies without stock information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">•</span>
                  <span>Fragmented health records leading to repeated tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">•</span>
                  <span>Language and literacy barriers in accessing healthcare</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Impact</h3>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Eliminate long-distance travel through remote video consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Enable quick consults and after-hours appointments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Real-time medicine availability to prevent wasted trips</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Comprehensive digital health records for continuity of care</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Voice-enabled multilingual interface for all users</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cutting-edge technology designed for rural healthcare accessibility
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Stack Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            Technology Stack
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-green-600 mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Next.js & React</li>
                <li>• Tailwind CSS</li>
                <li>• WebRTC for Video</li>
                <li>• Google Web Speech API</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-green-600 mb-3">Backend</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Python/Flask Microservices</li>
                <li>• Amazon RDS PostgreSQL</li>
                <li>• JWT Authentication</li>
                <li>• REST/Webhook APIs</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-green-600 mb-3">AI & Integration</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• LLM-based Symptom Checker</li>
                <li>• Google Maps API</li>
                <li>• Docker Containers</li>
                <li>• AWS EC2 Deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Model Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
          Sustainable Business Model
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Patient Subscriptions</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Priority queue access for faster consultations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Choose doctors by specialization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Reduced waiting times</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Extended consultation hours</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pharmacy Partnerships</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Monthly fee for digital inventory management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Increased visibility through platform integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real-time stock updates dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Greater patient outreach and footfall</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Team 6th Stack</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            A dedicated team of innovators committed to revolutionizing rural healthcare 
            through technology and compassion
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl px-8 py-4">
            <p className="text-green-100">
              Team ID: <span className="font-bold text-white">66890</span> | 
              Problem Statement: <span className="font-bold text-white">SIH25018</span>
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Join Us in Transforming Rural Healthcare
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience the future of accessible, affordable, and quality healthcare for rural India
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://development-medimitra.udayan.fyi/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Visit Platform
          </a>
          <a 
            href="https://youtu.be/F4z8ohlMu5U" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-green-600"
          >
            Watch Demo Video
          </a>
        </div>
      </div>
    </div>
  );
}
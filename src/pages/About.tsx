
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.section className="mb-16" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="glass-card rounded-2xl p-8">
              <h1 className="text-3xl font-bold mb-6">About SignWave</h1>
              
              <div className="prose prose-sm max-w-none text-foreground/80">
                <p className="text-lg leading-relaxed mb-4">
                  SignWave is a innovative tool designed to bridge communication gaps between the hearing and deaf communities through technology. Our mission is to make sign language more accessible and to foster inclusive communication for everyone.
                </p>
                
                <p className="text-lg leading-relaxed mb-4">
                  Using advanced speech recognition and visual interpretation, SignWave translates spoken words into sign language gestures in real-time, providing an intuitive way for people to learn and communicate using sign language.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Our Technology</h2>
                
                <p className="mb-4">
                  SignWave utilizes state-of-the-art technologies:
                </p>
                
                <ul className="list-disc ml-6 mb-6 space-y-2">
                  <li>Advanced speech recognition for accurate transcription</li>
                  <li>Fal.ai API integration for generating sign language videos</li>
                  <li>Real-time processing with secure API credential management</li>
                  <li>Responsive design that works on all devices</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Our Vision</h2>
                
                <p className="mb-4">
                  We believe in a world where technology serves as a bridge rather than a barrier. SignWave represents our commitment to using innovation to create more inclusive communication tools that respect and celebrate diverse ways of expression.
                </p>
                
                <p className="mb-4">
                  Our long-term goal is to expand SignWave's capabilities to support multiple sign languages from around the world and to develop more comprehensive learning tools for sign language education.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Methodology</h2>
                
                <p className="mb-4">
                  The SignWave project follows a comprehensive methodology that combines various technologies and approaches:
                </p>
                
                <ol className="list-decimal ml-6 mb-6 space-y-4">
                  <li>
                    <strong>Speech Recognition:</strong> Using browser-based Web Speech API to capture and transcribe spoken language in real-time. This provides the textual input that will be translated into sign language.
                  </li>
                  
                  <li>
                    <strong>Text Processing:</strong> The transcribed text undergoes processing to optimize it for sign language translation, including breaking down complex sentences and identifying key concepts.
                  </li>
                  
                  <li>
                    <strong>API Integration:</strong> The processed text is sent to the Fal.ai API, which specializes in generating visual content. Our implementation communicates with their video generation model specifically trained for sign language gestures.
                  </li>
                  
                  <li>
                    <strong>Video Rendering:</strong> The resulting sign language video is fetched from the API response and displayed to the user through our custom video player component.
                  </li>
                  
                  <li>
                    <strong>Responsive UI/UX:</strong> The entire application is built with React and Tailwind CSS to ensure a responsive, accessible interface that works across different devices and screen sizes.
                  </li>
                  
                  <li>
                    <strong>Error Handling:</strong> Robust error handling mechanisms ensure that users are informed of any issues that might arise during the speech recognition or video generation process.
                  </li>
                  
                  <li>
                    <strong>Continuous Development:</strong> We follow an iterative development process, constantly improving our algorithms and UI based on user feedback and technological advancements.
                  </li>
                </ol>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
                
                <p className="mb-4">
                  We're always looking to improve SignWave and welcome feedback and suggestions. If you have ideas, questions, or would like to collaborate, please reach out to us at <a href="mailto:contact@signwave.app" className="text-primary hover:underline">ch.en.u4aie22079@ch.students.amrita.edu</a>.
                </p>
              </div>
            </div>
          </motion.section>
          
          <motion.section className="mb-16" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.3,
          duration: 0.6
        }}>
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-3xl">👨‍💻</span>
                  </div>
                  <h3 className="text-lg font-medium">Thomas F. Wolobah Jr</h3>
                  <p className="text-sm text-muted-foreground">Founder & Lead Developer</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-accent/10 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-3xl">👩‍🎨</span>
                  </div>
                  <h3 className="text-lg font-medium">P Himavarsha</h3>
                  <p className="text-sm text-muted-foreground">UX Designer</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>;
};

export default About;

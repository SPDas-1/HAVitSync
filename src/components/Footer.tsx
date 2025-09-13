import React from "react";
import { Separator } from "@/components/ui/separator";
import { Github, Heart, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

// In a real application, you might want to use import.meta.env.PACKAGE_VERSION
// For now, we'll hardcode this based on the project's actual status
const APP_VERSION = "1.0.0"; // This would typically come from your package.json or environment variables

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Contact Us Section */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
          <p className="text-muted-foreground mb-8">Have questions or feedback? We'd love to hear from you!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  {/* <h3 className="font-medium">Email</h3> */}
                  <a href="mailto:contact@havitsync.com" className="text-muted-foreground hover:text-primary">
                    contact@havitsync.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  {/* <h3 className="font-medium">Phone</h3> */}
                  <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                    +91-9876543210
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-lg">
              <ContactForm />
            </div>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-wellness rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HAV</span>
              </div>
              <span className="text-xl font-bold">HAVitSync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your personal activity visualization and routine tracking platform
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-lg">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="#dashboard" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </a>
              <a 
                href="#trackers" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Trackers
              </a>
              <a 
                href="#stats" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Stats
              </a>
              <a 
                href="#insights" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                AI Insights
              </a>
              <a 
                href="#roadmap" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Coming Soon
              </a>
            </div>
          </div>
          
          {/* Social links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-lg">Connect</h3>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/AsmitSwain27/HAVitSync" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </a>
            
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="mb-4 sm:mb-0">
            &copy; {currentYear} HAVitSync | All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span>Version {APP_VERSION}</span>
            <span>•</span>
            <span className="flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by InnovateS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
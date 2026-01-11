import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
// import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { sendMessage } from "../../../services/apiSvc";

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendMessage({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      console.log("Message sent successfully:", response);
      // toast.success("Message sent successfully!");
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      // toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: "url(/images/contact-us.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-brandBlue/10 text-brandBlue px-4 py-2 rounded-full text-sm font-medium">
            <MessageCircle className="h-4 w-4" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-brandBlue to-primary bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="bg-black/30 p-4 text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed rounded-lg">
            Have questions about our services? Need support with your
            appointments? We're here to help you every step of the way.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-16 px-4 space-y-20">
        {/* Contact Information Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-lg">Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">Call us directly</p>
              <p className="font-semibold text-brandBlue">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mon-Fri 9AM-6PM
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">Send us an email</p>
              <p className="font-semibold text-brandBlue">
                support@carepoint.com
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                We reply within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">Visit our office</p>
              <p className="font-semibold text-brandBlue">123 Healthcare Ave</p>
              <p className="text-sm text-muted-foreground mt-1">
                Medical District, NY 10001
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle className="text-lg">Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">When we're available</p>
              <p className="font-semibold text-brandBlue">24/7</p>
              <p className="text-sm text-muted-foreground mt-1">
                Emergency support always
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact Form & FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="h-6 w-6 text-brandBlue" />
                Send us a Message
              </CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brandBlue hover:bg-brandBlue/90 text-white shadow-lg cursor-pointer"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-brandBlue" />
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about Care Point.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-brandBlue">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">
                    How do I book an appointment?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Simply create an account, browse available doctors and
                    clinics, and book your preferred time slot.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">
                    What if I need to cancel my appointment?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You can cancel appointments through your dashboard up to 24
                    hours before the scheduled time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">
                    Is my health information secure?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we use enterprise-grade encryption and comply with all
                    healthcare privacy regulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">
                    Do you accept all insurance plans?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We work with most major insurance providers. Contact us to
                    verify coverage for your plan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Media & Emergency Contact */}
        <section className="bg-gradient-to-r from-brandBlue/5 to-emerald-500/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-muted-foreground text-lg">
              Follow us for health tips and updates
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <Button variant="outline" size="lg" className="hover:bg-blue-50 cursor-pointer">
              <Facebook className="h-5 w-5 text-blue-600" />
            </Button>
            <Button variant="outline" size="lg" className="hover:bg-sky-50  cursor-pointer">
              <Twitter className="h-5 w-5 text-sky-500" />
            </Button>
            <Button variant="outline" size="lg" className="hover:bg-pink-50 cursor-pointer">
              <Instagram className="h-5 w-5 text-pink-600" />
            </Button>
            <Button variant="outline" size="lg" className="hover:bg-blue-50 cursor-pointer">
              <Linkedin className="h-5 w-5 text-blue-700" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contactus;

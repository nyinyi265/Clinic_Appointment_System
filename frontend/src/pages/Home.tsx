import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Heart,
  Stethoscope,
  Award,
  Zap,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: "url(/images/hero-image.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-brandBlue/10 text-brandBlue px-4 py-2 rounded-full text-sm font-medium">
            <Stethoscope className="h-4 w-4" />
            Healthcare Made Simple
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-brandBlue via-primary to-emerald-600 bg-clip-text text-transparent leading-tight">
            Your Health,
            <br />
            Our Priority
          </h1>

          <p className="bg-black/30 p-4 text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed rounded-lg">
            Experience healthcare booking reimagined. Connect with top doctors,
            schedule appointments effortlessly, and take control of your health
            journey with Care Point.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="bg-brandBlue hover:bg-brandBlue/90 text-white shadow-xl px-8 py-4 text-lg cursor-pointer"
              onClick={() => {
                if (token) {
                  navigate("/appointment");
                } else {
                  navigate("/login");
                }
              }}
            >
              Book Appointment Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="shadow-xl px-8 py-4 text-lg border-2 cursor-pointer"
              onClick={() => {
                if (token) {
                  navigate("/doctor");
                } else {
                  navigate("/login");
                }
              }}
            >
              Find a Doctor
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-white">Verified Doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-white">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-white">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brandBlue/5 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Care Point?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the features that make healthcare booking simple, secure,
              and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">
                  Easy Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Book appointments with your preferred doctors in just a few
                  clicks. Real-time availability and instant confirmation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-emerald-900">
                  Expert Doctors
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Access a network of verified, experienced healthcare
                  professionals across all medical specialties.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-purple-900">
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Your health information is protected with enterprise-grade
                  security and HIPAA-compliant privacy standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-orange-900">
                  24/7 Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Round-the-clock customer support to assist with appointments,
                  technical issues, and healthcare guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-pink-100/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl text-pink-900">
                  Patient-Centric
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Designed with patients in mind - intuitive interface,
                  personalized care recommendations, and compassionate support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-indigo-900">
                  Instant Access
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Access your medical records, appointment history, and health
                  information anytime, anywhere from any device.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-brandBlue to-primary rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl opacity-90">
                Join our growing community of satisfied patients and doctors
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-lg opacity-90">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-lg opacity-90">Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">Partner Clinics</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
                <div className="text-lg opacity-90">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting healthcare has never been easier. Follow these simple
              steps to book your appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-brandBlue/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-brandBlue">1</span>
              </div>
              <h3 className="text-xl font-semibold">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up in seconds and create your personal health profile with
                secure authentication.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold">Find & Book</h3>
              <p className="text-muted-foreground">
                Browse verified doctors, check availability, and book
                appointments that fit your schedule.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold">Get Care</h3>
              <p className="text-muted-foreground">
                Attend your appointment, receive quality care, and manage your
                health records digitally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real experiences from real patients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "Care Point made booking my doctor's appointment so simple.
                  The interface is intuitive and I received confirmation
                  instantly. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brandBlue/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-brandBlue">
                      SM
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Mitchell</div>
                    <div className="text-sm text-muted-foreground">Patient</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "As a busy professional, finding time for doctor visits was
                  challenging. Care Point solved this perfectly with their easy
                  scheduling system."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-600">
                      JD
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">James Davis</div>
                    <div className="text-sm text-muted-foreground">
                      Business Executive
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-5 w-5 text-brandBlue" />
                  <span className="text-sm font-medium text-brandBlue">
                    Verified Review
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "The doctors on Care Point are all verified and professional.
                  I felt confident knowing I was getting quality healthcare
                  through their platform."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">
                      MR
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Parent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-brandBlue via-primary to-emerald-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have already discovered the
            convenience of Care Point. Your health journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="shadow-xl px-8 py-4 text-lg"
            >
              Start Your Journey
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-brandBlue shadow-xl px-8 py-4 text-lg"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

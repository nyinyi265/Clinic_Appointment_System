import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Users,
  Shield,
  Clock,
  Award,
  Stethoscope,
  Star,
  CheckCircle,
  ArrowRight,
  Target,
  Eye,
  Zap
} from 'lucide-react';

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brandBlue/10 via-background to-muted/30 py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-brandBlue/10 text-brandBlue px-4 py-2 rounded-full text-sm font-medium">
            <Stethoscope className="h-4 w-4" />
            About Care Point
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-brandBlue to-primary bg-clip-text text-transparent">
            Revolutionizing Healthcare
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building the future of healthcare by connecting patients with exceptional medical professionals
            through innovative technology and compassionate care.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-16 px-4 space-y-20">
        {/* Mission & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="border-none shadow-lg bg-gradient-to-br from-brandBlue/5 to-brandBlue/10">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-brandBlue/20 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-brandBlue" />
              </div>
              <CardTitle className="text-2xl text-brandBlue">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-lg leading-relaxed">
                To democratize healthcare access by creating an intuitive platform that empowers patients
                to easily connect with qualified healthcare professionals, ensuring timely and quality medical care for everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-emerald-600">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-lg leading-relaxed">
                A world where healthcare is seamlessly accessible, personalized, and proactive.
                We envision a healthcare ecosystem where technology bridges the gap between patients and providers,
                fostering better health outcomes through innovation and empathy.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-to-r from-brandBlue/5 to-emerald-500/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-muted-foreground text-lg">Numbers that speak to our commitment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brandBlue mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-muted-foreground">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-muted-foreground">Partner Clinics</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-xl">Compassion</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  We approach every interaction with empathy, understanding that healthcare decisions
                  are deeply personal and important.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Trust & Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Your health information deserves the highest level of protection.
                  We maintain strict security standards and privacy protocols.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  We continuously evolve our platform with cutting-edge technology
                  to provide the best possible healthcare experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Care Point?</h2>
            <p className="text-muted-foreground text-lg">Experience healthcare booking reimagined</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brandBlue/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-brandBlue" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy Appointment Booking</h3>
                  <p className="text-muted-foreground">Schedule appointments with just a few clicks, anytime, anywhere.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Verified Healthcare Professionals</h3>
                  <p className="text-muted-foreground">Connect with licensed and experienced doctors across all specialties.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">Our dedicated support team is always ready to assist you.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">Rigorous standards ensure you receive the best possible care.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500/10 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Patient-Centric Approach</h3>
                  <p className="text-muted-foreground">Your health and convenience are our top priorities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
                  <p className="text-muted-foreground">Your personal health information is protected with enterprise-grade security.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-brandBlue to-primary rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have transformed their healthcare experience with Care Point.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="shadow-lg">
              Book Your Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brandBlue shadow-lg">
              Contact Us
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Aboutus;
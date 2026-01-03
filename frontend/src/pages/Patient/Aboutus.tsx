import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto py-16 px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are dedicated to providing seamless healthcare appointment management for patients and doctors alike.
            Our platform connects you with the best healthcare professionals in your area.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Our Mission</h2>
            <p className="text-muted-foreground">
              To make healthcare accessible and convenient by providing an easy-to-use platform for booking and managing medical appointments.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Our Vision</h2>
            <p className="text-muted-foreground">
              To revolutionize healthcare appointment systems with technology that benefits both patients and healthcare providers.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Aboutus;
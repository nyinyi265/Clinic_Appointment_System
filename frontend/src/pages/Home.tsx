import Navbar from '../components/common/navbar';
import Footer from '../components/common/footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-16 px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Clinic Appointment System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Book and manage your medical appointments with ease. Our system ensures a seamless experience for patients and doctors alike.
          </p>
          <button className="mt-6 bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition">
            Get Started
          </button>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Easy Booking</h2>
            <p className="text-muted-foreground">Schedule appointments online in just a few clicks.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Doctor Profiles</h2>
            <p className="text-muted-foreground">View detailed profiles and reviews of our healthcare professionals.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Notifications</h2>
            <p className="text-muted-foreground">Receive reminders and updates about your appointments.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
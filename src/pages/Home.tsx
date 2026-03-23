import Hero from '@/components/home/Hero';
import WorkflowSteps from '@/components/home/WorkflowSteps';
import Integrations from '@/components/home/Integrations';
import Footer from '@/components/shared/Footer';

const Home = () => (
  <div className="min-h-screen bg-background">
    <Hero />
    <WorkflowSteps />
    <Integrations />
    <Footer />
  </div>
);

export default Home;

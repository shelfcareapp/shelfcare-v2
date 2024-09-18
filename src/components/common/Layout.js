import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
// import TidioLoader from '@/components/common/TidioLoader';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      {/* <TidioLoader /> */}
    </>
  );
}

export default Layout;

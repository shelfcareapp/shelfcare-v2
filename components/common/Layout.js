import Header from 'components/common/Header';
import Footer from 'components/common/Footer';

function Layout({ children, hideFooter }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default Layout;

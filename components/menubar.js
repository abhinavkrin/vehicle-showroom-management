import { useState } from 'react';
import { Navbar, Nav, Container, NavbarBrand } from 'react-bootstrap';
import styles from '../styles/Menubar.module.css';
import FirebaseAuthMenuButton from './auth/firebase/ui/FirebaseAuthMenuButton';

export default function Menubar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Container fluid className='border-bottom'>
      <Navbar expand='lg' className='bg-white mx-3 my-1'>
        {/* <BrandLogo 
          brandLink={'/'}
          logoLink={'https://global-uploads.webflow.com/611a19b9853b7414a0f6b3f6/611bbb87319adfd903b90f24_logoRC.svg'}
          imageTitle={'Rocket.Chat'}
          brandName={'Rocket.Chat Community'}
          height={21}
          width={124}
        /> */}
        <NavbarBrand href='/'>ShowRooom X</NavbarBrand>
        <Navbar.Toggle
          aria-controls='basic-navbar-nav'
          className={styles.default_toggler+" ms-auto"}
        >
          <button
            className={`${styles.navbar_toggler} navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around bg-white`}
            type='button'
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <span
              className={`${styles.toggler_icon} ${
                collapsed ? styles.top_bar_collapsed : styles.top_bar
              }`}
            ></span>
            <span
              className={`${styles.toggler_icon} ${
                collapsed ? styles.bottom_bar_collapsed : styles.bottom_bar
              }`}
            ></span>
          </button>
        </Navbar.Toggle>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mx-auto'>
            <Nav.Link href='/' className='fw-light'>
                Home
            </Nav.Link>
            <Nav.Link href='/admin' className='fw-light'>
                Admin
            </Nav.Link>
            <Nav.Link href='/dealer' className='fw-light'>
                Dealer
            </Nav.Link>
            <Nav.Link href='/mybookings' className='fw-light'>
                My bookings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="mx-1">
          <FirebaseAuthMenuButton/>
        </div>
      </Navbar>
    </Container>
  );
}

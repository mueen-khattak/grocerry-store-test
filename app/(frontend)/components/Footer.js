import styles from './ComponentsStyles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Store Info */}
        <div className={styles.storeInfo}>
          <h3>Grocery Store</h3>
          <p>Your one-stop shop for fresh groceries!</p>
          <p>123 Market Street, Cityville, Country</p>
          <p>Phone: +1 (234) 567-8901</p>
          <p>Email: support@grocerystore.com</p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className={styles.newsletter}>
          <h4>Subscribe to our Newsletter</h4>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        {/* Social Media */}
        <div className={styles.social}>
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Grocery Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

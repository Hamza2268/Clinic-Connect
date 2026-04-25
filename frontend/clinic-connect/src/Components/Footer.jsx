import styles from "../Style/Footer.module.css";

function Footer() {
  return (
    <footer>
      <div className={styles.footerTitle}>Clinic Connect</div>
      <div className={styles.footerText}>
        Transforming healthcare coordination for underserved communities through
        innovative technology and seamless integration.
      </div>
      <div className={`${styles.footerText} ${styles.services}`}>
        <div>Privacy Policy</div>
        <div>Terms of Service</div>
        <div>Contact Us</div>
        <div>Support</div>
      </div>
      <div className={styles.footerText}>
        © 2025 Clinic Connect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

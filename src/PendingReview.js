import React from 'react';

const PendingReview = () => {
  const handleBackToApp = () => {
    // Logic to navigate back to the app, modify as needed
    window.location.href = "braver://payment_added"; // 
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.logoutButton}>Log Out</button>
      </div>
      <div style={styles.content}>
        <h1 style={styles.title}>Your request is pending review...</h1>
        <p style={styles.description}>
          Please allow up to 24 hours to review your profile and notify you via email when you've been approved.
          If you have any questions, please email us at <a href="mailto:info@braverhospitality.com" style={styles.emailLink}>info@braverhospitality.com</a>
        </p>
        <button style={styles.backButton} onClick={handleBackToApp}>Go back to app</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage: 'url(https://example.com/background-image.png)', // Replace with your background image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#06090F',
    padding: '20px',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    backgroundColor:'',
    justifyContent: 'center'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginTop: '20px',
    marginBottom: '40px',
  },
  emailLink: {
    color: '#fff',
    textDecoration: 'underline',
  },
  backButton: {
    backgroundColor: '#14A5BF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default PendingReview;

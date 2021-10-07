import { useState } from 'react';
import { Helmet } from 'react-helmet';
import styles from '../styles/Home.module.css';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Home({ user }) {
  const [url, setURL] = useState(null);
  const [copy, setCopy] = useState('Copy File');

  const openWidget = () => {
    setURL(null);
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: 'dtgbzmpca',
          uploadPreset: 'tca2j0ee',
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            setURL(result.info.url);
          }
        }
      )
      .open();
  };

  const handleCopyToClip = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => setCopy('Copied!'))
      .catch((err) => console.log('error copying to clipboard', err));
  };

  return (
    <div>
      <Helmet>
        <script src='https://upload-widget.cloudinary.com/global/all.js' />
      </Helmet>
      <main className={styles.files}>
        <header className={styles.header}>
          <a href='/api/auth/logout' className={styles.logout}>
            Log Out
          </a>
        </header>
        <p className={styles.name}>Hi {user.name}</p>
        <div className={styles.container}>
          <div className={styles.buttonwrapper}>
            <button className={styles.button} onClick={() => openWidget()}>
              Upload file and Generate Link
            </button>
          </div>
          {url && (
            <div className={styles.formwrapper}>
              <h5>Shareable link</h5>
              <input disabled value={url} className={styles.input} />
              <button className={styles.copy} onClick={handleCopyToClip}>
                {copy}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/',
});

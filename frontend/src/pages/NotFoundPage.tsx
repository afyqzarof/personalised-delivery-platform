import styles from './WelcomePage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.status} role="alert">
        <p className={styles.errorTitle}>Page not found</p>
        <p className={styles.errorDetail}>
          Open your welcome page at <code>/welcome/:userId</code>.
        </p>
      </div>
    </main>
  )
}

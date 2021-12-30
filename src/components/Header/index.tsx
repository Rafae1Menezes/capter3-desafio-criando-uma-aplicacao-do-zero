import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <>
      <img src="/logo.svg" alt="logo" className={styles.logo} />
    </>
  );
}

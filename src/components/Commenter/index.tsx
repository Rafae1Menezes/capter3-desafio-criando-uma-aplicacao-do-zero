export default function Commenter(): JSX.Element {
  return (
    <section
      style={{ width: '100%', marginBottom: '5rem' }}
      ref={element => {
        if (!element) {
          return;
        }

        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', 'https://utteranc.es/client.js');
        scriptElement.setAttribute(
          'repo',
          'Rafae1Menezes/utterances-comments-app'
        );
        scriptElement.setAttribute('issue-term', 'url');
        scriptElement.setAttribute('theme', 'photon-dark');
        scriptElement.setAttribute('crossorigin', 'anonymous');
        scriptElement.setAttribute('async', 'true');
        element.replaceChildren(scriptElement);
      }}
    />
  );
}

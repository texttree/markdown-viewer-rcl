import { Box, Link } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownViewer({ children, config, goToReference, fontSize }) {
  const { server, owner, languageId, projectId } = config;
  const transformLinkUri = (uri) => {
    return changeUri({
      uri,
      server,
      owner,
      languageId,
    });
  };
  const fixUrl = (content) => {
    if (!content) {
      return;
    }
    const links = content.match(/\[{2}\S+\]{2}/g);
    if (!links) {
      return content;
    }
    let contentWithUrl = content;

    links.forEach((el) => {
      const changeUrl = contentWithUrl
        .replace('[[', `[${el.replace(/\[{2}|\]{2}/g, '')}](`)
        .replace(']]', ')');
      contentWithUrl = changeUrl;
    });

    return contentWithUrl;
  };
  const content = typeof children === 'string' ? fixUrl(children) : '';
  const changeUri = ({ uri, server, owner, languageId }) => {
    if (!uri) {
      return;
    }

    const _link = uri.replace('rc://*', languageId).replace('rc://', '');
    const tw = ['/other/', '/kt/', '/names/'];
    let url = '';
    const reference = _link.split('/');
    if (tw.find((item) => _link.includes(item)) && reference) {
      const resourceId = 'tw';
      let filePath = '';
      switch (reference.length) {
        case 3:
          filePath = `${reference[1]}/${reference[2]}`;
          url = `#page=${server}/${owner}/${languageId}_${resourceId}/raw/branch/master/bible/${filePath}`;
          break;
        case 6:
          filePath = `${reference[4]}/${reference[5]}`;
          url = `#page=${server}/${owner}/${languageId}_${resourceId}/raw/branch/master/bible/${filePath}.md`;
          break;
        default:
          break;
      }
      return url;
    }
    if (_link.includes('/ta/man/')) {
      const resourceId = 'ta';
      const filePath = `${reference[3]}/${reference[4]}`;
      url = `#page=${server}/${owner}/${languageId}_${resourceId}/raw/branch/master/${filePath}/01.md`;
      return url;
    }
    if (_link.includes('/help/')) {
      url = `/${reference[3]}/${String(parseInt(reference[4]))}/${String(
        parseInt(reference[5])
      )}`;
      return url;
    }
  };
  const fontSizeProvider = {
    fontSize: fontSize + '%',
  };
  return (
    <Box style={fontSizeProvider}>
      <ReactMarkdown
        components={{
          a: (props) => {
            if (!props?.href) {
              if (
                props?.node?.properties?.href &&
                props?.node?.properties?.href.match(/^\d\d?\/\d\d?$/gm)
              ) {
                return (
                  <div
                    // className={classes.link}
                    onClick={() => {
                      const reference = props.node.properties.href.split('/');

                      goToReference(
                        projectId,
                        String(parseInt(reference[0])),
                        String(parseInt(reference[1]))
                      );
                    }}
                    aria-hidden="true"
                  >
                    {props.children[0]}
                  </div>
                );
              }
              return <span>{props.children[0]}</span>;
            }
            return props.href.startsWith('/') ? (
              <div
                // className={classes.link}
                onClick={() => {
                  const reference = props.href.split('/');

                  goToReference(reference[1], reference[2], reference[3]);
                }}
                aria-hidden="true"
              >
                {props.children}
              </div>
            ) : (
              <Link href={props.href}>{props.children}</Link>
            );
          },
        }}
        transformLinkUri={transformLinkUri}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

export default MarkdownViewer;

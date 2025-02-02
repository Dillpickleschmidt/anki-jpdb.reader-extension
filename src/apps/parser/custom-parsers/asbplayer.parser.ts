import { AutomaticParser } from '../automatic.parser';

export class ASBPlayerParser extends AutomaticParser {
  // Define selectors for both versions
  private readonly SELECTORS = [
    '.asbplayer-subtitles-container-bottom > div > span',  // Web player
    '#root > div > div.jss4 > div.jss49 > div > div > p'   // Local parser
  ];

  protected addedObserverCallback(nodes: HTMLElement[]): void {
    nodes.forEach(node => {
      const doc = node.ownerDocument;
      
      // Try both possible containers
      const webContainer = doc.querySelector('.asbplayer-subtitles-container-bottom');
      const localContainer = doc.querySelector('#root > div > div.jss4');
      const container = webContainer || localContainer;
      
      if (container instanceof HTMLElement) {
        this.ensureStyles(doc);

        const observer = new MutationObserver(() => {
          // Try to find subtitles using both selectors
          this.SELECTORS.forEach(selector => {
            container.querySelectorAll(selector).forEach(element => {
              if (element instanceof HTMLElement) {
                if (!element.parentElement?.classList.contains('ajb-subtitle-wrapper')) {
                  // Capture original font styles before removing them
                  const computedStyle = window.getComputedStyle(element);
                  const originalFontSize = computedStyle.fontSize;
                  const originalFontFamily = computedStyle.fontFamily;
                  
                  element.removeAttribute('style');
                  
                  // Create outer wrapper with captured font styles
                  const subtitleWrapper = doc.createElement('div');
                  subtitleWrapper.className = 'ajb-subtitle-wrapper';
                  Object.assign(subtitleWrapper.style, {
                    fontSize: originalFontSize,
                    fontFamily: originalFontFamily,
                    fontWeight: '700',
                    lineHeight: '1.5',
                    zIndex: '2',
                    webkitFontSmoothing: 'antialiased',
                    textShadow: `
                      0px 3.75px 0.5px #000,
                      3.675px 0.7875px 0.5px #000,
                      1.575px -3.4125px 0.5px #000,
                      -3px -2.25px 0.5px #000,
                      -2.85px 2.4375px 0.5px #000,
                      1.8px 3.3px 0.5px #000,
                      3.6px -1.05px 0.5px #000,
                      -0.2625px -3.75px 0.5px #000,
                      -3.7125px -0.5625px 0.5px #000,
                      -1.3125px 3.525px 0.5px #000,
                      3.15px 2.025px 0.5px #000,
                      2.6625px -2.625px 0.5px #000,
                      -2.025px -3.15px 0.5px #000,
                      -3.525px 1.3125px 0.5px #000,
                      0.525px 3.7125px 0.5px #000,
                      3.75px 0.3px 0.5px #000,
                      1.0875px -3.6px 0.5px #000,
                      -3.2625px -1.8px 0.5px #000,
                      -2.475px 2.8125px 0.5px #000,
                      2.2125px 3px 0.5px #000,
                      3.4125px -1.5375px 0.5px #000,
                      -0.7875px -3.675px 0.5px #000,
                      -3.75px -0.0375px 0.5px #000,
                      -0.825px 3.675px 0.5px #000,
                      3.4125px 1.575px 0.5px #000,
                      2.2875px -3px 0.5px #000,
                      -2.4375px -2.85px 0.5px #000,
                      -3.3px 1.7625px 0.5px #000,
                      1.0125px 3.6px 0.5px #000,
                      3.75px -0.225px 0.5px #000,
                      0.5625px -3.7125px 0.5px #000,
                      -3.4875px -1.35px 0.5px #000,
                      -2.0625px 3.15px 0.5px #000,
                      2.625px 2.7px 0.5px #000,
                      3.1875px -1.9875px 0.5px #000,
                      -1.275px -3.525px 0.5px #000,
                      -3.7125px 0.4875px 0.5px #000,
                      -0.3px 3.75px 0.5px #000,
                      3.6px 1.0875px 0.5px #000,
                      1.8375px -3.2625px 0.5px #000,
                      -2.8125px -2.5125px 0.5px #000,
                      -3.0375px 2.2125px 0.5px #000,
                      1.5px 3.45px 0.5px #000,
                      3.675px -0.75px 0.5px #000,
                      0.075px -3.75px 0.5px #000,
                      -3.6375px -0.8625px 0.5px #000,
                      -1.6125px 3.375px 0.5px #000,
                      2.9625px 2.2875px 0.5px #000,
                      5px 5px 2px rgba(0, 0, 0, 0.8)
                    `
                  });
                  
                  // Wrap jpdb words that aren't misparsed or unparsed
                  element.querySelectorAll('.jpdb-word:not(.misparsed):not(.unparsed)').forEach(word => {
                    if (word instanceof HTMLElement && !word.parentElement?.classList.contains('jpdb-segment')) {
                      const segmentWrapper = doc.createElement('div');
                      segmentWrapper.className = 'jpdb-segment';
                      word.parentNode?.insertBefore(segmentWrapper, word);
                      segmentWrapper.appendChild(word);

                      // Apply additional styles to ruby and rt elements
                      word.querySelectorAll('ruby, rt').forEach(elem => {
                        if (elem instanceof HTMLElement) {
                          elem.style.color = 'inherit';
                          elem.style.fontSize = elem.tagName === 'RT' ? '60%' : 'inherit';
                          if (elem.tagName === 'RT') {
                            elem.style.userSelect = 'none';
                            elem.style.pointerEvents = 'none';
                          }
                        }
                      });
                    }
                  });
                  
                  element.parentNode?.insertBefore(subtitleWrapper, element);
                  subtitleWrapper.appendChild(element);
                }
              }
            });
          });
        });

        observer.observe(container, { 
          subtree: true, 
          attributes: true, 
          childList: true 
        });
      }
    });

    super.addedObserverCallback(nodes);
  }

  private ensureStyles(doc: Document): void {
    if (doc.getElementById('ajb-jpdb-styles')) return;

    const styleSheet = doc.createElement('style');
    styleSheet.id = 'ajb-jpdb-styles';
    styleSheet.textContent = `
      .jpdb-segment {
        position: relative;
        border-radius: 0.25em;
        padding: 0 2px;
        display: inline-block;
        white-space: pre-wrap;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
      }

      .jpdb-segment::before {
        content: "";
        position: absolute;
        top: 0px;
        bottom: -4px;
        left: -8px;
        right: -8px;
        border-radius: 0.125em;
        opacity: 0;
        transition: opacity 0.15s ease;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(5px);
        z-index: 0;
        pointer-events: none;
      }

      .jpdb-segment:hover::before {
        opacity: 1;
      }

      .jpdb-word {
        position: relative;
        z-index: 1;
      }

      .jpdb-word.misparsed { color: rgb(255, 0, 0); background-color: lightgray; }
      .jpdb-word.locked { color: #a0522d; }
      .jpdb-word.suspended { color: #696969; }
      .jpdb-word.blacklisted { color: #b0b0b0; }
      .jpdb-word.never-forget { color: #9370db; }
      .jpdb-word.not-in-deck { color: inherit; }
      .jpdb-word.new { color: #ff4500; }
      .jpdb-word.learning { color: #4169e1; }
      .jpdb-word.known { color: #228b22; }
      .jpdb-word.due { color: #ffd700; }
      .jpdb-word.failed { color: #dc143c; }
    `;

    doc.head.appendChild(styleSheet);
  }
}

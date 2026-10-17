import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { FileText, X } from "lucide-react";

// const StyledModal = styled(Modal)`
//   .modal-dialog {
//     max-width: 440px;
//     margin: 0.9375rem auto;
//   }

//   .modal-content {
//     border: none;
//     border-radius: 14.31px;
//     box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
//     overflow: hidden;
//   }
// `;

const StyledModal = styled(Modal)`
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding-left: 15px !important;
  padding-right: 15px !important;

  .modal-dialog {
    width: 100%;
    max-width: 440px;
    margin: 0 auto !important;
  }

  .modal-content {
    border: none;
    border-radius: 14.31px;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    width: 100%;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18.57px 8.42px 8px 8.42px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6.73px;
`;

const IconBox = styled.div`
  background: linear-gradient(180deg, #eddcfb 0%, #fbf2fc 100%);
  width: 35px;
  height: 35px;
  border-radius: 42.09px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b2b7b;
`;

const ModalHeading = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #97538c;
  letter-spacing: -0.3px;
  font-family: "Inter", sans-serif;
  line-height: 13.47px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #7b809a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f5f7;
    color: #222;
  }
`;

const ContentBody = styled.div`
  padding: 8px 8.42px 18.57px 8.42px;
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e4ea;
    border-radius: 4px;
  }
`;

const SectionCard = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(250, 248, 254, 1);
  border-radius: 7.58px;
  padding: 9.26px 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
`;

const BadgeHeader = styled.div`
  display: inline-block;
  background: #f4e7fc;
  color: #530a81;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 42.09px;
  margin-bottom: 6px;
  font-family: "Inter", sans-serif;
`;

const PointsList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PointItem = styled.li`
  display: flex;
  align-items: flex-start;
  font-size: 10px;
  color: #242976;
  font-weight: 500;
  font-family: "Inter", sans-serif;
`;

const PointIndex = styled.span`
  font-weight: 600;
  color: #242976;
  margin-right: 6px;
  flex-shrink: 0;
`;

const PointText = styled.span`
  flex: 1;
`;

const FallbackBox = styled.div`
  font-size: 13.5px;
  color: #2b3674;
  line-height: 1.5;

  strong,
  h1,
  h2,
  h3,
  h4 {
    display: inline-block;
    background: #fbf0f8;
    color: #8b2b7b;
    padding: 3px 10px;
    border-radius: 8px;
    font-size: 13px;
    margin-top: 10px;
    margin-bottom: 6px;
  }

  ol,
  ul {
    padding-left: 20px;
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 8px;
  }
`;

export default function TermsModal({ show, onHide, htmlContent }) {
  const sections = useMemo(() => {
    if (!htmlContent) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const children = Array.from(doc.body.children);

      const list = [];
      let currentSec = null;

      children.forEach((el) => {
        if (el.tagName === "P" && el.innerHTML.trim() === "<br>") return;

        const isHeading =
          el.tagName.match(/^H[1-6]$/) ||
          (el.tagName === "P" &&
            el.querySelector("strong") &&
            el.textContent.trim().length < 70);

        if (isHeading) {
          if (currentSec) list.push(currentSec);
          currentSec = {
            title: el.textContent.trim(),
            items: [],
            htmlBody: "",
          };
        } else if (el.tagName === "OL" || el.tagName === "UL") {
          const items = Array.from(el.querySelectorAll("li")).map((li) =>
            li.textContent.trim(),
          );
          if (currentSec) {
            currentSec.items.push(...items);
          } else {
            list.push({ title: "", items, htmlBody: "" });
          }
        } else {
          if (currentSec) {
            currentSec.htmlBody += el.outerHTML;
          } else {
            list.push({ title: "", items: [], htmlBody: el.outerHTML });
          }
        }
      });

      if (currentSec) list.push(currentSec);
      return list;
    } catch {
      return [];
    }
  }, [htmlContent]);

  return (
    <StyledModal show={show} onHide={onHide} centered>
      <HeaderWrapper>
        <HeaderLeft>
          <IconBox>
            <FileText size={18} />
          </IconBox>
          <ModalHeading>Terms & Condition</ModalHeading>
        </HeaderLeft>
        <CloseButton onClick={onHide} aria-label="Close">
          <X size={20} />
        </CloseButton>
      </HeaderWrapper>

      <ContentBody>
        {sections.length > 0 ? (
          sections.map((sec, idx) => (
            <SectionCard key={idx}>
              {sec.title && <BadgeHeader>{sec.title}</BadgeHeader>}

              {sec.items && sec.items.length > 0 && (
                <PointsList>
                  {sec.items.map((text, i) => (
                    <PointItem key={i}>
                      <PointIndex>{i + 1}.</PointIndex>
                      <PointText>{text}</PointText>
                    </PointItem>
                  ))}
                </PointsList>
              )}

              {sec.htmlBody && (
                <div
                  style={{
                    fontSize: "13.5px",
                    color: "#2b3674",
                    marginTop: "6px",
                  }}
                  dangerouslySetInnerHTML={{ __html: sec.htmlBody }}
                />
              )}
            </SectionCard>
          ))
        ) : (
          <FallbackBox dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </ContentBody>
    </StyledModal>
  );
}

import React from "react";
import PropTypes from "prop-types";
import { styled } from "linaria/react";
import layouts from "./layouts";
import excludeProps from "./exclude-props";

const SlideContainer = styled.div``;

const Slide = styled.div`
  background: ${props => props.background};
`;

const SlideNumber = styled(excludeProps("index", "div"))`
  position: absolute;
  top: ${({ index }) => (index + 1) * 100 - 5}vh;
  right: 3vw;
  opacity: 0.8;
`;

const SlideProgress = styled(excludeProps(["color", "ratio"], "div"))`
  position: fixed;
  width: ${({ ratio }) => ratio * 100}%;
  height: 3vh;
  top: 97vh;
  background-color: ${props => props.color};
  opacity: 0.8;
`;

function Slides({ slide, slides = [], theme, presentationID }) {
  return (
    <SlideContainer>
      {slides.map((slide, index) => {
        const slideKey = `slide-${index}`;

        // Slides are given class names for keyboard navigation to work.
        return (
          <Slide className={slideKey} key={slideKey}>
            {React.createElement(getLayout(slide.layout), {
              ...slide,
              theme,
              presentationID
            })}
            {index ? (
              <SlideNumber index={index}>
                {index}/{slides.length - 1}
              </SlideNumber>
            ) : null}
          </Slide>
        );
      })}
      {slide ? (
        <SlideProgress
          color={theme.secondaryColor}
          ratio={slide / (slides.length - 1)}
        >
          &nbsp;
        </SlideProgress>
      ) : null}
    </SlideContainer>
  );
}
Slides.propTypes = {
  slide: PropTypes.number,
  slides: PropTypes.array,
  theme: PropTypes.object,
  presentationID: PropTypes.string
};

function getLayout(id) {
  if (!layouts[id]) {
    throw new Error(`No layout found for ${id}`);
  }

  return layouts[id];
}

export default Slides;

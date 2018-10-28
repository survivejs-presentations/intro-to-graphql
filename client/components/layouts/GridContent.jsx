import React from "react";
import PropTypes from "prop-types";
import { styled } from "linaria/react";
import { modularScale } from "polished";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock.jsx";

const GridContainer = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  display: grid;
  grid-template-rows: 0.25fr 1.75fr;
  align-items: center;
  line-height: 1.5;
  background: ${props => props.background};
`;

const Title = styled.h1`
  font-size: ${modularScale(6)};
  margin-left: 5vw;
  color: ${props => props.color};
`;

const Markup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: ${modularScale(4)};
  margin-left: 5vw;
  align-self: start;
  color: ${props => props.color};
`;

const GridContent = ({ content = {}, theme = {} }) => (
  <GridContainer background={content.background && content.background.asset}>
    <Title color={theme.primaryColor}>
      <ReactMarkdown source={content.title} />
    </Title>
    <Markup color={theme.secondaryColor}>
      <ReactMarkdown
        source={content.columns[0]}
        renderers={{ code: CodeBlock }}
      />
      <ReactMarkdown
        source={content.columns[1]}
        renderers={{ code: CodeBlock }}
      />
    </Markup>
  </GridContainer>
);
GridContent.propTypes = {
  content: PropTypes.object,
  theme: PropTypes.object
};

export default GridContent;
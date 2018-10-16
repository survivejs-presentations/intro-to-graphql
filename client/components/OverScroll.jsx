/* react-over-scroll - MIT Copyright (c) 2016 Gregor Adams */
import React from "react";
import PropTypes from "prop-types";
import root from "window-or-global";
import EventTracker from "./EventTracker.jsx";

class OverScroll extends React.Component {
  /**
   * a scroll based slideshow with wings
   * @param {Object} props
   * @param {String} props.className
   * @param {Number} props.initialPage - the index of the initial page to show
   * @param {Function} props.onPageChange - triggered when a page is changed
   * @param {render} props.children - render function for children
   * @param {string} props.anchors - allow navigation via pagers
   *                                 (`anchors='!/works'` will create a url hashbang `#!/works/[1,2,3...]``)
   *                                 (`anchors='works'` will create a url hash `#works/[1,2,3...]``)
   * @param {Number} props.slides - number of slides
   * @param {Number} [props.factor = 1] - scroll factor defines how many viewport heights page
   *  have to be scrolled to trigger the next page
   *  - 1 = 100vh
   *  - 2 = 200vh
   * @param {Number} props.throttleRate = 0 - rate in milliseconds to throttle events
   *  - defaults to no throttling
   */
  constructor(props) {
    super(props);
    this.state = {
      scrollY: root.scrollY,
      counter: Math.min(
        Math.max(props.initialPage, 0),
        props.slides && props.slides.length - 1
      ),
      scrollOffset: 0
    };
    this.updateScroll = this.updateScroll.bind(this);
  }
  /**
   * @typedef render
   * @type Function
   * @param {Number} index - currently active index
   * @param {Number} percent - percent of active slide scrolled
   * @return {ReactNode} - returns a reactDOM element
   */

  componentWillReceiveProps(nextProps) {
    if (this.props.initialPage !== nextProps.initialPage) {
      this.setState({ counter: nextProps.initialPage });
    }
  }

  /**
   * checks for the current position and translates the scroll to index and percent
   * @param  {Number} scrollY - window.scrollY
   */
  updateScroll(scrollY) {
    let fixed;
    let snapToBottom;
    let counter = 0;
    let scrollOffset = 0;

    // make sure the tracker element exists
    if (!this.tracker) {
      return;
    }
    // get the offset and check if the top or bottom have been reached
    // top activates the snap mode
    // bottom deactivates the snap mode
    const { top, bottom } = this.tracker.getBoundingClientRect();
    const innerHeight = root.innerHeight || 0;
    const touchedTop = top <= 0;
    const touchedEnd = bottom <= innerHeight;
    if (touchedTop && !touchedEnd) {
      fixed = true;
      counter = Math.max(
        0,
        Math.min(
          this.props.slides - 1,
          ~~((top * (-1 / this.props.factor)) / innerHeight)
        )
      );
      scrollOffset = Math.max(
        0,
        Math.min(
          100,
          (((top * -1) % (innerHeight * this.props.factor)) /
            innerHeight /
            this.props.factor) *
            100
        )
      );
    } else if (touchedEnd) {
      snapToBottom = true;
      counter = this.props.slides - 1;
      scrollOffset = 100;
    }

    if (this.state.counter !== counter) {
      this.props.onPageChange && this.props.onPageChange(counter);
    }

    this.setState({
      scrollY,
      fixed,
      counter,
      scrollOffset,
      bottom: snapToBottom
    });
  }

  /**
   * the frame is used to define the scrollable height.
   * It works as a `position: sticky` wrapper
   * @return {Object} returns a style object
   */
  get frameStyle() {
    const slideCount = this.props.slides;
    const factor = this.props.factor || 1;
    const vh = slideCount * 100 * factor + 100;
    return {
      height: `${vh}vh`,
      position: "relative",
      margin: 0
    };
  }

  /**
   * @return {Object} returns a sticky position
   */
  get overlayStyle() {
    return {
      position: "sticky",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: "100vh"
    };
  }

  /**
   * allow to use deeplinks and clickable pagers to navigate
   * to speciffic pages inside the slider. Paging is done by simply jumpimg
   * to the correct id.
   * @return {null|ReactNode} returns a div with elements that have an id
   */
  get anchors() {
    if (!this.props.anchors) {
      return null;
    }
    const anchorStyle = {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    const vh = 100 * (this.props.factor || 1);
    const anchors = [];
    for (let i = 0; i < this.props.slides; i++) {
      const id = `${this.props.anchors}/${i + 1}`;
      const props = {
        id,
        key: id,
        style: {
          display: "block",
          marginTop: i > 0 ? "1px" : 0,
          height: i > 0 ? `calc(${vh}vh - 1px)` : `${vh}vh`
        }
      };
      anchors.push(<span {...props} />);
    }
    return <div style={anchorStyle}>{anchors}</div>;
  }

  render() {
    return (
      <div className={this.props.className}>
        <EventTracker
          onScroll={this.updateScroll}
          throttleRate={this.props.throttleRate}
        />
        <div
          style={this.frameStyle}
          ref={x => {
            this.tracker = x;
          }}
        >
          {this.anchors}
          <div style={this.overlayStyle}>
            {this.props.children(
              this.state.counter,
              this.state.scrollOffset,
              this.props.anchors
            )}
          </div>
        </div>
      </div>
    );
  }
}
OverScroll.propTypes = {
  className: PropTypes.string,
  children: PropTypes.func.isRequired,
  anchors: PropTypes.string,
  slides: PropTypes.number.isRequired,
  factor: PropTypes.number.isRequired,
  throttleRate: PropTypes.number,
  initialPage: PropTypes.number,
  onPageChange: PropTypes.func
};
OverScroll.defaultProps = {
  factor: 1,
  throttleRate: 0,
  initialPage: 0,
  onPageChange: function() {}
};

export default OverScroll;

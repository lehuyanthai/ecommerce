import "./about.scss";

import React from "react";

const About = () => {
  return (
    <div className="about">
      <div className="section1">
        <div style={{ textAlign: "center" }}>
          <h1 className="about-page__big-title">
            We believe we can
            <br />
            all make a difference.
          </h1>
          <p className="about-page__tagline">
            Our way: Exceptional quality.
            <br />
            Ethical factories. Radical Transparency.
          </p>
        </div>
      </div>
      <div className="section2">
        <div style={{ textAlign: "center" }}>
          <p className="about-page__mission-quote">
            At Naboat, we want the right choice to be as easy as putting on a
            great T-shirt. That’s why we partner with the best, ethical
            factories around the world. Source only the finest materials. And
            share those stories with you—down to the true cost of every product
            we make. It’s a new way of doing things. We call it Radical
            Transparency.
          </p>
        </div>
      </div>
      <div className="section3">
        <div className="section3__image">
          <img
            src="https://media.everlane.com/image/upload/c_fill,dpr_1.0,f_auto,g_face,h_700,q_auto,w_700/v1/i/4a5e24a2_85d5.jpg"
            alt=""
          />
        </div>
        <div className="section3__benefit-explanation">
          <h4 className="section-title">OUR FACTORIES</h4>
          <h3 className="title">Our ethical approach.</h3>
          <p>
            We spend months finding the best factories around the world—the same
            ones that produce your favorite designer labels. We visit them often
            and build strong personal relationships with the owners. Each
            factory is given a compliance audit to evaluate factors like fair
            wages, reasonable hours, and environment. Our goal? A score of 90 or
            above for every factory.
          </p>
        </div>
      </div>
      <div className="section3 section4">
        <div className="section3__image">
          <img
            src="https://media.everlane.com/image/upload/c_fill,dpr_1.0,f_auto,g_face,h_620,q_auto,w_620/v1/i/06a23e68_6bda.jpg"
            alt=""
          />
        </div>
        <div
          className="section3__benefit-explanation"
          style={{ marginLeft:"0px",marginRight: "5%" }}
        >
          <h4 className="section-title">OUR QUANLITY</h4>
          <h3 className="title">Designed to last.</h3>
          <p>
            At Naboat, we’re not big on trends. We want you to wear our pieces
            for years, even decades, to come. That’s why we source the finest
            materials and factories for our timeless products— like our Grade-A
            cashmere sweaters, Italian shoes, and Peruvian Pima tees.
          </p>
        </div>
      </div>
      <div className="section5">
      </div>
    </div>
  );
};

export default About;

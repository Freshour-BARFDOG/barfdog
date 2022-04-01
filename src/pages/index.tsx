import React from "react";
import Icon from "/public/test.svg";
import styles from "/styles/Home.module.css";
import Head from 'next/head';


function MyComponent() {
  return (
    <section
      className="myCom"
      style={{ "background-color": "blue", padding: "20px 0 " }}
    >
      myComponent입니다.
    </section>
  );
}

function MyComponent2() {
  return (
    <section
      className="myCom2"
      style={{ "background-color": "red", padding: "20px 0 " }}
    >
      myComponent2
    </section>
  );
}

function Header(props) {
  const variable = "green";
  return (
    <div className="title">
      <h1>heading Props: {props.heading}</h1>
      <MyComponent>
        컴포넌트 사이에 끼여있는것은 출력되지 않는다.
        <MyComponent2 />
      </MyComponent>
      {/* <style>
        {
          `
          h1 {
            color: ${variable}
          }
          `
        }
      </style> */}
      <div className={styles.container__outer}>
        container-outer
        <div className={styles.container}>
          container
          <div className="row">
            row
            <div className={styles.test}>test 이너</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function home() {
  return (
    <div>
      <Head>
        <title>Barfdog | Home</title>
      </Head>
      <Header heading="headingProp!" />
      <h1>home</h1>
      <Icon />
      {/* <img src={Icon} alt="" srcset="" /> */}
    </div>
  );
}

export default home;

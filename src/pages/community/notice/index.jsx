import React from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import Styles from '/styles/css/community/notice/index.module.scss'

function NoticeIndexPage() {

  return (
    <Layout>
      <Wrapper>
        <section className={Styles.title}>
          <p className={Styles.text}>공지사항</p>
        </section>

        <section className={Styles.notice_board_box}>
          <div className={Styles.grid_box}>
            <span>No.</span>
            <p>제목</p>
            <span>등록일</span>
          </div>
          
          <div className={Styles.content_box}>
            <span>50</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>49</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>48</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>47</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>46</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>45</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>44</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>43</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>42</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>41</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>40</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>39</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>38</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>37</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
          <div className={Styles.content_box}>
            <span>36</span>
            <p>설날 배송 안내</p>
            <sapn>2022.01.20</sapn>
          </div>
        </section>


        <section className={Styles.page_no}>
          <div className={Styles.pagination_box}>
            <div className={Styles.content}>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>...</div>
              <div>11</div>
              <div> &#62;</div>
            </div>
          </div>
        </section>
      </Wrapper>
    </Layout>
  );
}

export default NoticeIndexPage;
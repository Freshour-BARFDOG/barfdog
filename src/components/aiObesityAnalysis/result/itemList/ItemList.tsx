import styles from '../Result.module.scss';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Text from "@src/components/commonV2/text/Text";
import Button from "@src/components/commonV2/button/Button";
import { discountUnitType } from "@store/TYPE/discountUnitType";
import { getItemsByIds } from "service/aiObesityAnalysis";
import { getRecommendItemIds } from "constants/aiObesityAnalysis";

export default function ItemList() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // 환경에 따른 아이템 ID 가져오기
        const itemIds = getRecommendItemIds();
        const fetchedItems = await getItemsByIds(itemIds);
        setItems(fetchedItems);
      } catch (error) {
        console.error('아이템 로딩 실패:', error);
      }
    };

    fetchItems();
  }, []);

  if (!items.length) return <div className={styles.resultContainer}>상품이 없습니다.</div>;

  return (
    <article className={styles.itemListContainer}>
      <Text type='title3' align='center'>체중관리 추천 상품</Text>
      <div className={styles.itemList}>
        {items.map(item => {
          const isSale = (item.salePrice !== item.originalPrice) && item.discountDegree > 0;
          return (
            <a
              key={item.id} 
              href={`/shop/item/${item.id}`} 
              target='_blank'
              rel="noreferrer"
            >
              <div className={styles.itemLink}>
                <Image 
                  src={item.imageUrl || '/img/commonV2/no-image.png'} 
                  alt={item.name}
                  width={276}
                  height={276}
                  className={styles.itemImage}
                  onError={(e) => {
                    e.currentTarget.src = '/img/commonV2/no-image.png';
                  }}
                />
                <div className={styles.itemInfo}>
                  <Text type='body3' color='gray800'>{item.name}</Text>
                  {isSale && (
                    <div className={styles.itemPrice}>
                      <Text type='caption2' color='red'>할인특가</Text>
                      <Text type='caption2' color='gray600' className={styles.originalPrice}>{item.originalPrice.toLocaleString()}원</Text>
                    </div>
                  )}
                  <div className={styles.itemPrice}>
                    {isSale && 
                      <Text type='headline1' color='red'>{item.discountDegree}{discountUnitType.KOR[item.discountType]}</Text>
                    }
                    <Text type='headline1'>{item.salePrice.toLocaleString()}원</Text>
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>
      <Button variant='outline' onClick={() => router.push('/shop?page=1&size=6&sortBy=recent&itemType=ALL')}>
        스토어 가기
      </Button>
    </article>
  );
}
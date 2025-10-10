import styles from "../Survey.module.scss";
import Button from "@src/components/commonV2/button/Button";
import ButtonDocked from "@src/components/commonV2/buttonDocked/ButtonDocked";

interface SurveyButtonProps {
  isMobile: boolean;
  showPrevButton?: boolean;
  nextButtonLabel?: string;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

export default function SurveyButton({
  isMobile,
  showPrevButton = true,
  nextButtonLabel = '다음',
  handleNextStep,
  handlePrevStep,
}: SurveyButtonProps) {
  return (
    isMobile ? (
        <ButtonDocked
          type={showPrevButton ? 'dual-button' : 'full-button'}
          primaryButtonLabel={nextButtonLabel}
          onPrimaryClick={handleNextStep}
          secondaryButtonLabel='이전'
          onSecondaryClick={handlePrevStep}
        />
      ) : (
        <div className={styles.surveyButtonBox}>
          {showPrevButton && (
            <Button
              variant='outline'
              type='secondary'
              size='lg'
              onClick={handlePrevStep}
              className={styles.surveyButton}
              >
                이전
            </Button>
          )}
          <Button
            type='primary'
            size='lg'
            onClick={handleNextStep}
            className={styles.surveyButton}
          >
            {nextButtonLabel}
          </Button>
        </div>
      )
  );
}
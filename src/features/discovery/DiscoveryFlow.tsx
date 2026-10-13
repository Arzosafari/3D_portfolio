import { useState } from 'react';
import { aiService, type DiscoveryAnswers, type ExperienceRecommendation } from '../../services/aiService';
import { useEnvironment } from '../../environment/EnvironmentProvider';

const questions: Array<{
  key: keyof DiscoveryAnswers;
  eyebrow: string;
  title: string;
  options: string[];
}> = [
  {
    key: 'industry',
    eyebrow: 'YOUR BUSINESS',
    title: 'What kind of business are you building for?',
    options: ['Fashion', 'Healthcare', 'E-commerce', 'Restaurant', 'Technology', 'Professional services', 'Other'],
  },
  {
    key: 'goal',
    eyebrow: 'YOUR NEXT MOVE',
    title: 'What would make this experience a success?',
    options: ['Increase sales', 'Generate leads', 'Build a brand', 'Improve customer experience', 'Automate support'],
  },
  {
    key: 'style',
    eyebrow: 'YOUR CREATIVE DIRECTION',
    title: 'How should it feel to use?',
    options: ['Minimal', 'Premium', 'Interactive', 'Immersive', 'Futuristic'],
  },
];

const emptyAnswers: DiscoveryAnswers = { industry: '', goal: '', style: '' };

export default function DiscoveryFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiscoveryAnswers>(emptyAnswers);
  const [recommendation, setRecommendation] = useState<ExperienceRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAIState, setProfile } = useEnvironment();

  const reset = () => {
    setAnswers(emptyAnswers);
    setProfile({});
    setAIState('idle');
    setStep(0);
    setRecommendation(null);
    setError('');
    setLoading(false);
  };

  const choose = (value: string) => {
    const key = questions[step].key;
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    setProfile(nextAnswers);
    setAIState('discovery');
    setError('');
  };

  const next = async () => {
    if (!answers[questions[step].key] || loading) return;
    if (step < questions.length - 1) {
      setAIState('discovery');
      setStep((current) => current + 1);
      return;
    }

    setLoading(true);
    setAIState('thinking');
    setError('');
    try {
      const result = await aiService.generateRecommendation(answers);
      setRecommendation(result);
      setProfile(answers);
      setAIState('success');
      setStep(questions.length);
    } catch (cause) {
      setAIState('discovery');
      setError(cause instanceof Error ? cause.message : 'We couldn’t create your recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (step > 0 && step < questions.length) {
      setAIState('discovery');
      setStep((current) => current - 1);
    } else if (recommendation) {
      setRecommendation(null);
      setAIState('discovery');
      setStep(questions.length - 1);
    }
  };

  const currentQuestion = questions[Math.min(step, questions.length - 1)];
  const selectedValue = answers[currentQuestion.key];

  return (
    <div className={`discovery-card ${recommendation ? 'discovery-card--result' : ''}`}>
      <div className="discovery-card__topline">
        <div className="discovery-product-label"><span className="discovery-orbit-icon"><i /></span><span><strong>EXPERIENCE FINDER</strong><small>Personalized for your business</small></span></div>
        <span className="discovery-time">~ 30 SEC</span>
      </div>

      {!recommendation ? (
        <div className="discovery-content">
          <div className="discovery-progress-row">
            <div className="discovery-progress" aria-label={`Step ${step + 1} of 3`}>
              {questions.map((question, index) => (
                <span key={question.key} className={index <= step ? 'is-complete' : ''} />
              ))}
            </div>
            <span className="discovery-step-count">0{step + 1}<i> / 03</i></span>
          </div>
          <div className="discovery-question" key={step}>
            <p className="eyebrow eyebrow--small">{currentQuestion.eyebrow}</p>
            <h3>{currentQuestion.title}</h3>
            <div className={`discovery-options discovery-options--${step === 0 ? 'business' : 'short'}`} role="group" aria-label={currentQuestion.title}>
              {currentQuestion.options.map((option, index) => (
                <button
                  className={`discovery-option ${selectedValue === option ? 'is-selected' : ''}`}
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  aria-pressed={selectedValue === option}
                >
                  <span className="option-index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{option}</span>
                  <i aria-hidden="true">↗</i>
                </button>
              ))}
            </div>
          </div>
          {error && <p className="discovery-error" role="alert">{error}</p>}
          <div className="discovery-actions">
            <button className="discovery-back" type="button" onClick={back} disabled={step === 0}>← <span>Back</span></button>
            <button className="button button--acid discovery-next" type="button" onClick={() => void next()} disabled={!selectedValue || loading}>
              {loading ? <><span className="mini-spinner" /> Building your direction</> : step === questions.length - 1 ? <>Build my recommendation <span aria-hidden="true">↗</span></> : <>Continue <span aria-hidden="true">↗</span></>}
            </button>
          </div>
        </div>
      ) : (
        <div className="recommendation-result">
          <div className="recommendation-header">
            <span className="result-kicker"><i /> YOUR RECOMMENDED EXPERIENCE</span>
            <span className="result-fit">faratech_lab MATCH <strong>96</strong></span>
          </div>
          <div className="recommendation-title-wrap">
            <span className="result-category">{recommendation.category}</span>
            <h3>{recommendation.title}</h3>
            <p className="recommendation-summary">{recommendation.summary}</p>
          </div>
          <p className="recommendation-rationale">{recommendation.rationale}</p>
          <div className="recommendation-features">
            {recommendation.features.map((feature, index) => (
              <div className="recommendation-feature" key={feature}><span>0{index + 1}</span><p>{feature}</p><i aria-hidden="true">↗</i></div>
            ))}
          </div>
          <div className="recommendation-actions">
            <a className="button button--acid" href="#contact">Start building this experience <span aria-hidden="true">↗</span></a>
            <button className="start-over" type="button" onClick={reset}>Start over</button>
          </div>
        </div>
      )}
    </div>
  );
}

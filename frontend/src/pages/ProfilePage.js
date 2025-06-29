import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, createProfile, updateProfile } from '../api/profile';
import '../styles/ProfilePage.css';

const initialData = {
  age: '',
  gender: '',
  location: '',
  openness: 3,
  conscientiousness: 3,
  extraversion: 3,
  agreeableness: 3,
  neuroticism: 3,
  hobbies: [],       // e.g. ['Sports','Music']
  smoking: 'no',     // 'yes' | 'no' | 'occasionally'
  drinking: 'no',    // same options
};

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // On mount, load existing profile (if any)
  useEffect(() => {
    getProfile()
      .then(data => {
        if (data) setForm({ ...initialData, ...data });
      })
      .catch(() => {
        /* no profile yet */
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleHobby = hobby => {
    setForm(prev => {
      const list = prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby];
      return { ...prev, hobbies: list };
    });
  };

  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setError('');
    try {
      // decide create vs update based on backend response shape
      await createProfile(form);
      navigate('/matches');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <p>Loading your profile…</p>;

  return (
    <div className="profile-container">
      <h1>Complete Your Profile</h1>
      {error && <div className="error">{error}</div>}

      {step === 1 && (
        <div className="step">
          <h2>Step 1: Basic Info</h2>
          <label>
            Age
            <input
              type="number"
              value={form.age}
              onChange={e => handleChange('age', e.target.value)}
            />
          </label>
          <label>
            Gender
            <select
              value={form.gender}
              onChange={e => handleChange('gender', e.target.value)}
            >
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Location
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="step">
          <h2>Step 2: Personality (1–5)</h2>
          {['openness','conscientiousness','extraversion','agreeableness','neuroticism'].map(trait => (
            <label key={trait}>
              {trait.charAt(0).toUpperCase() + trait.slice(1)}
              <input
                type="range"
                min="1" max="5"
                value={form[trait]}
                onChange={e => handleChange(trait, +e.target.value)}
              />
              <span>{form[trait]}</span>
            </label>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="step">
          <h2>Step 3: Lifestyle & Interests</h2>
          <fieldset>
            <legend>Hobbies (select all that apply)</legend>
            {['Sports','Music','Travel','Reading','Cooking','Gaming'].map(hobby => (
              <label key={hobby}>
                <input
                  type="checkbox"
                  checked={form.hobbies.includes(hobby)}
                  onChange={() => toggleHobby(hobby)}
                />
                {hobby}
              </label>
            ))}
          </fieldset>
          <label>
            Smoking
            <select
              value={form.smoking}
              onChange={e => handleChange('smoking', e.target.value)}
            >
              <option>no</option>
              <option>yes</option>
              <option>occasionally</option>
            </select>
          </label>
          <label>
            Drinking
            <select
              value={form.drinking}
              onChange={e => handleChange('drinking', e.target.value)}
            >
              <option>no</option>
              <option>yes</option>
              <option>occasionally</option>
            </select>
          </label>
        </div>
      )}

      <div className="buttons">
        {step > 1 && <button onClick={back}>Back</button>}
        {step < 3 ? (
          <button onClick={next}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit Profile</button>
        )}
      </div>
    </div>
  );
}

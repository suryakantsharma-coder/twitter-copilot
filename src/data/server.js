import axios from 'axios';
export const getUserSuggestedTopics = async () => {
  let data = JSON.stringify({
    region: 'IN',
    type: 'technology',
    subtypes: 'solidity, web3, dev',
    isHashtag: true,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/analysis/twitter-trends-by-users',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const response = await axios.request(config);
  return response.data;
};

import React from 'react';
import { TrendingUp, PieChart, Users } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="mt-24">
    <div className="grid md:grid-cols-3 gap-8 bg-blue-50">
      <div className="text-center p-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
        <p className="text-gray-600">
          Advanced machine learning algorithms analyze market patterns to predict future trends with 94% accuracy.
        </p>
      </div>
      <div className="text-center p-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <PieChart className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Optimization</h3>
        <p className="text-gray-600">
          AI-driven portfolio rebalancing recommendations to maximize returns while managing risk exposure.
        </p>
      </div>
      <div className="text-center p-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Insights</h3>
        <p className="text-gray-600">
          Get personalized investment advice from AI that learns from top financial advisors and market experts.
        </p>
      </div>
    </div>
  </footer>
);
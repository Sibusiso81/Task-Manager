import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface Behavior {
  name: string;
  description: string;
  type: 'good' | 'bad' | 'neutral';
}

const allBehaviors: Behavior[] = [
  { name: "High efficiency", description: "Consistently completes tasks ahead of schedule", type: "good" },
  { name: "Proactive problem solving", description: "Identifies and addresses issues before they escalate", type: "good" },
  { name: "Adaptability", description: "Quickly adjusts to new tasks and changing priorities", type: "good" },
  { name: "Strong time management", description: "Effectively allocates time to complete all tasks", type: "good" },
  { name: "Attention to detail", description: "Produces high-quality work with minimal errors", type: "good" },
  { name: "Procrastination", description: "Tends to delay starting or completing tasks", type: "bad" },
  { name: "Inconsistent performance", description: "Quality and quantity of work varies significantly", type: "bad" },
  { name: "Poor time estimation", description: "Frequently underestimates time required for tasks", type: "bad" },
  { name: "Lack of initiative", description: "Rarely takes on additional responsibilities or suggests improvements", type: "bad" },
  { name: "Moderate productivity", description: "Completes tasks at an average pace", type: "neutral" },
  { name: "Steady performance", description: "Maintains a consistent level of work quality and quantity", type: "neutral" },
  { name: "Adequate time management", description: "Generally completes tasks within expected timeframes", type: "neutral" },
];

interface InferredBehaviorsProps {
  satisfaction: number;
  taskCompletionRate: number;
  timeEfficiency: number;
}

const InferredBehaviors: React.FC<InferredBehaviorsProps> = ({ satisfaction, taskCompletionRate, timeEfficiency }) => {
  const getInferredBehaviors = (): Behavior[] => {
    const behaviors: Set<Behavior> = new Set();
    
    if (satisfaction > 8 && taskCompletionRate > 0.9 && timeEfficiency > 9) {
      behaviors.add(allBehaviors.find(b => b.name === "High efficiency") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Adaptability") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Attention to detail") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Proactive problem solving") || allBehaviors[0]);
    }
    
    if (taskCompletionRate > 0.8 && timeEfficiency > 8) {
      behaviors.add(allBehaviors.find(b => b.name === "Strong time management") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Steady performance") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Attention to detail") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Moderate productivity") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Proactive problem solving") || allBehaviors[0]);
    }
    
    if (satisfaction < 5 && taskCompletionRate < 0.5) {
      behaviors.add(allBehaviors.find(b => b.name === "Procrastination") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Inconsistent performance") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Lack of initiative") || allBehaviors[0]);
    }
    
    if (timeEfficiency < 5) {
      behaviors.add(allBehaviors.find(b => b.name === "Poor time estimation") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Lack of initiative") || allBehaviors[0]);
    }
    
    if (behaviors.size === 0) {
      behaviors.add(allBehaviors.find(b => b.name === "Moderate productivity") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Adequate time management") || allBehaviors[0]);
      behaviors.add(allBehaviors.find(b => b.name === "Steady performance") || allBehaviors[0]);
    }
    
    return Array.from(behaviors);
  };

  const inferred = getInferredBehaviors();

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Inferred Behaviors</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 md:grid-cols-3 space-y-4 justify-items-center">
          {inferred.map((behavior, index) => (
        <li key={index} className="flex items-start space-x-3">
          {behavior.type === 'good' && <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />}
          {behavior.type === 'bad' && <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />}
          {behavior.type === 'neutral' && <MinusCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />}
          <div>
            <Badge 
        variant={behavior.type === 'good' ? "default" : behavior.type === 'bad' ? "destructive" : "default"}
          className="mb-1"
            >
          {behavior.name}
            </Badge>
            <p className="text-sm text-muted-foreground">{behavior.description}</p>
          </div>
        </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InferredBehaviors;

import {
  Heart,
  Plane,
  GraduationCap,
  Coffee,
  Car,
  Home,
  Shield,
  Zap,
  Users,
  Trophy,
  Clock,
} from "lucide-react";

export const benefitIcons = [
  { value: "heart", label: "Healthcare", icon: Heart },
  { value: "plane", label: "Travel", icon: Plane },
  { value: "graduation", label: "Education", icon: GraduationCap },
  { value: "coffee", label: "Perks", icon: Coffee },
  { value: "car", label: "Transportation", icon: Car },
  { value: "home", label: "Remote Work", icon: Home },
  { value: "shield", label: "Insurance", icon: Shield },
  { value: "zap", label: "Energy", icon: Zap },
  { value: "users", label: "Team", icon: Users },
  { value: "trophy", label: "Achievement", icon: Trophy },
  { value: "clock", label: "Flexible Hours", icon: Clock },
];

export const getBenefitIcon = (iconType) => {
  const iconMap = {
    heart: Heart,
    plane: Plane,
    graduation: GraduationCap,
    coffee: Coffee,
    car: Car,
    home: Home,
    shield: Shield,
    zap: Zap,
    users: Users,
    trophy: Trophy,
    clock: Clock,
  };
  const IconComponent = iconMap[iconType] || Heart;
  return IconComponent;
}; 
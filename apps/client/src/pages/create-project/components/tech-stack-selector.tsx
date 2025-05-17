import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
const TechStackSelector = () => {
  return (
    <div className="space-y-10 ">
      <Label htmlFor="framework" className="text-white  text-sm">
        Tech Stack
      </Label>
      <Select>
        <SelectTrigger className=" border-[#333] focus:ring-0 w-full my-2 focus:border-gray-500">
          <SelectValue defaultValue={'reactjs'} placeholder="ReactJs" />
        </SelectTrigger>
        <SelectContent defaultValue={'reactjs'} className="bg-[#1a1a1a] text-white border-[#333] w-ful ">
          <SelectItem value="reactjs">ReactJs</SelectItem>
          <SelectItem value="vuejs">VueJs</SelectItem>
          <SelectItem value="mern">MERN Stack</SelectItem>
          <SelectItem value="nodejs">Nodejs</SelectItem>
          <SelectItem value="nodejs">HTML,CSS,JS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TechStackSelector;

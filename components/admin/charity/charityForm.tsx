import { countries } from "@/store/countries";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCharity from "@/hooks/use-charity";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
type CharityListProps = {
  search: string;
  page: number;
  active: boolean;
  limit: number;
};

export default function CharityForm({page,search,active,limit}:CharityListProps) {

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
  name: "",
  description: "",
  websiteUrl: "",
  country: "",
  isActive: true,
  isFeatured: false,
});
const [logoFile, setLogoFile] = useState<File | null>(null);
const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const createCharity=useCharity().createCharity
    const getCharities=useCharity().getCharities

const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }
};
//handle Image Change
const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);

  setImages((prev) => [...prev, ...files]);

  const previews = files.map((file) => URL.createObjectURL(file));
  setImagePreviews((prev) => [...prev, ...previews]);
};

//validate form
const validateForm = () => {
  if (!formData.name.trim()) return "Name is required";
  if (!formData.description.trim()) return "Description is required";
  if (!formData.country) return "Country is required";

  if (formData.websiteUrl) {
    const isValidUrl = /^https?:\/\/.+/.test(formData.websiteUrl);
    if (!isValidUrl) return "Invalid website URL";
  }

  return null;
};

//handle form submission

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const error = validateForm();
  if (error) {
    alert(error);
    return;
  }


  // Create FormData (for file upload)
  const payload = new FormData();

  payload.append("name", formData.name);
  payload.append("description", formData.description);
  payload.append("websiteUrl", formData.websiteUrl || "");
  payload.append("country", formData.country || "");

  payload.append("isActive", String(formData.isActive));
  payload.append("isFeatured", String(formData.isFeatured));

  if (logoFile) {
    payload.append("files", logoFile);
  }
  const Imagemeta=images.map((_,index)=>({altText:"image"+index,order:index}))
  payload.append("images",JSON.stringify(Imagemeta))
  images.forEach((img) => {
    payload.append("files", img);
  });
  await createCharity.mutate(payload,{onSuccess:()=>{
    setFormData({
      name: "",
      description: "",
      websiteUrl: "",
      country: "",
      isActive: true,
      isFeatured: false,
    });
    getCharities(page,limit,search,active).refetch()
    setLogoFile(null);
    setLogoPreview(null);
    setImages([]);
    setImagePreviews([]);
    toast("Charity created successfully!")
  },onError:()=>{
    toast.error("Failed to create charity. Please try again.")
  }})

};

  return (
 <Card className="max-w-2xl mb-10 mx-auto mt-10 rounded-2xl shadow-md border border-[#1a5c42]/20">
      <CardHeader>
        <CardTitle className="text-2xl text-[#1a5c42]">
          Create Charity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-2">
            <Label htmlFor="charity-logo" className="text-[#1a5c42]">
              Charity Logo
            </Label>

            <label
              htmlFor="charity-logo"
              className="w-24 h-24 rounded-full border-2 border-dashed border-[#1a5c42]/40 bg-[#1a5c42]/5 flex items-center justify-center text-[#1a5c42] hover:bg-[#1a5c42]/10 cursor-pointer overflow-hidden transition"
            >
              {logoPreview ? (
                <img src={logoPreview} className="w-full h-full object-cover" />
              ) : (
                "+ Upload"
              )}
            </label>

            <Input
              id="charity-logo"
              type="file"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-[#1a5c42]">Charity Name</Label>
            <Input
            value={formData?.name}
            onChange={e=>setFormData(prev=>({...prev,name:e.target.value}))}
              placeholder="Enter charity name"
              className="focus-visible:ring-[#1a5c42]"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[#1a5c42]">Description</Label>
            <Input
            value={formData?.description}
            onChange={e=>setFormData(prev=>({...prev,description:e.target.value}))}
              placeholder="Enter description"
              className="focus-visible:ring-[#1a5c42]"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label className="text-[#1a5c42]">Website</Label>
            <Input
            value={formData?.websiteUrl}
            onChange={e=>setFormData(prev=>({...prev,websiteUrl:e.target.value}))}
              placeholder="https://example.com"
              className="focus-visible:ring-[#1a5c42]"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-[#1a5c42]">Country</Label>
            <Select onValueChange={value=>setFormData(prev=>({...prev,country:value}))} value={formData?.country} >
              <SelectTrigger className="focus:ring-[#1a5c42]">
                <SelectValue  placeholder="Select Country" >
                  {formData?.country }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

                {/* Status */}
<div className="space-y-2">
  <Label className="text-[#1a5c42]">Status</Label>

<RadioGroup
  value={formData.isActive ? "true" : "false"}
  onValueChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      isActive: value === "true",
    }))
  }
    className="flex gap-6"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={"true"} id="active" />
      <Label htmlFor="active">Active</Label>
    </div>

    <div className="flex items-center space-x-2">
      <RadioGroupItem value={"false"} id="inactive" />
      <Label htmlFor="inactive">Inactive</Label>
    </div>
  </RadioGroup>
</div>
          {/* Featured */}
          <div>
    <RadioGroup
  value={formData.isFeatured ? "true" : "false"}
  onValueChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      isFeatured: value === "true",
    }))
  }
  className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" className="border-[#1a5c42]" />
                <Label htmlFor="yes">Yes</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" className="border-[#1a5c42]" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Images */}
        <div className="space-y-2">
  <Label className="text-[#1a5c42]">Charity Images</Label>

  {/* Upload Box */}
  <label
    htmlFor="charity-images"
    className="w-full min-h-[120px] border-2 border-dashed border-[#1a5c42]/40 rounded-xl flex flex-col items-center justify-center text-[#1a5c42] cursor-pointer hover:bg-[#1a5c42]/5 transition"
  >
    <span className="text-sm font-medium">Click to upload</span>
    <span className="text-xs text-gray-500">PNG, JPG (multiple allowed)</span>
  </label>

  <Input
    id="charity-images"
    type="file"
    multiple
    className="hidden"
    onChange={handleImagesChange}
  />

  {/* Preview Grid */}
  {images.length > 0 && (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
      {imagePreviews.map((img, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden border"
        >
          <img
            src={img}
            className="w-full h-24 object-cover"
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={() =>
              setImages((prev) => prev.filter((_, i) => i !== index))
            }
            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>

          {/* Submit */}
          <Button className="w-full bg-[#1a5c42] hover:bg-[#144734] text-white">
            {createCharity.isPending?<p className="flex gap-2">Creating Charity <CgSpinner className="animate-spin"/></p>:"Create Charity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
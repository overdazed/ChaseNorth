import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FilterSidebar = () => {

    // declare state variable to read and modify the query parameters
    const [searchParams, setSearchParams] = useSearchParams();

    // navigate to the new URL with the updated query parameters
    const navigate = useNavigate();


    // let's consider an example of URL with query parameters: x.com/?a=1&b=2
    // in this URL we are particularly interested in the query parameters of a and b -> a = 1, b = 2
    // extract this information from the URL using the useSearchParams hook

    // like: Category, Price, Color, Size, etc.
    const [filters, setFilters] = useState({
        // declare category key
        category: "",
        gender: "",
        // declare price key
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    // declare a price range to work with
    const [priceRange, setPriceRange] = useState([0, 100]);

    // !!!! to display the items that you see on the sidebar, we'll need to declare a few variables !!!!
    // you can store them in a database
    const categories = ["Top Wear", "Bottom Wear"];

    const colors = [
        "Red",
        "Blue",
        "Black",
        "Green",
        "Yellow",
        "Gray",
        "White",
        "Pink",
        "Beige",
        "Navy",
    ]

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

    const materials = [
        "Cotton",
        "Wool",
        "Denim",
        "Polyester",
        "Silk",
        "Linen",
        "Viscose",
        "Fleece",
        "Leather",
        "Synthetic",
    ]

    const brands = [
        "Urban Threads",
        "Modern Fit",
        "Street Style",
        "Beach Breeze",
        "Fashionista",
        "ChicStyle",
    ]

    const genders = ["Men", "Women"]

    useEffect(() => {
        // create a constant to convert these search params into plane object
        // if you look at the URL, we have parameters, which we have obtained using the useSearchParams hook
        // but these will be stores in the form of array of key and value pairs
        const params = Object.fromEntries([...searchParams]);
        // with the above statement, convert the information into JavaScript object
        // {category: 'Top Wear', maxPrice: '100'} => if I want the category, I say: params.category

        // set the default filters value
        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100
        })
        // setPriceRange([params.minPrice || 0, params.maxPrice || 100]);
        setPriceRange([0, params.maxPrice || 100]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;

        // store multiple values are stored when the checkbox is clicked
        let newFilters = {...filters};
        // check if the filter is of type checkbox
        if (type === "checkbox") {
            if (checked) {
                // if the checkbox is checked, add the value to the array
                // if no checkbox is checked, it will be an empty array
                // else append the value to the array
                newFilters[name] = [...(newFilters[name] || []), value]; // ["XS", "S"]
            } // if it is unchecked, remove the value from the array
            else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            newFilters[name] = value;
        }

        setFilters(newFilters);

        // call the function to update the URL
        updateURLParams(newFilters);

        // console.log(newFilters);
        // update the filters state
    }

    // Update the URL
    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        // {category: 'Top Wear', size: ["XS", "S"]} => if I want the category, I say: params.category
        Object.keys(newFilters).forEach((key) => {
            // if the value of the key is an array
            // && if not an empty array
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(",")); // "XS, S"
            } else if(newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        })
        setSearchParams(params);
        navigate(`?${params.toString()}`); // ?category=Bottom+Wear&size=XS%2CS
    }

    // work on the price range
    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice]);
        const newFilters = {...filters, minPrice: 0, maxPrice: newPrice};
        setFilters(filters);
        // update the URL
        updateURLParams(newFilters);
    }

    return (
        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {/*look through the categories*/}
                {categories.map((category) => (
                    <div
                    key={category} className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            onChange={handleFilterChange}
                            checked={filters.category === category}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"/>
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Gender</label>
                {/*look through the categories*/}
                {genders.map((gender) => (
                    <div
                        key={gender} className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="gender"
                            value={gender}
                            onChange={handleFilterChange}
                            checked={filters.gender === gender}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"/>
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            name="color"
                            value={color}
                            onClick={handleFilterChange}
                            className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition
                                hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500" : ""
                            }`} style={{ backgroundColor: color.toLowerCase()}}></button>
                    ))}
                </div>
            </div>

            {/* Size Filer */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size</label>
                {sizes.map((size) => (
                    <div
                        key={size} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="size"
                            value={size}
                            onChange={handleFilterChange}
                            checked={filters.size.includes(size)}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{size}</span>
                    </div>
                ))}
            </div>

            {/* Material Filer */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Material</label>
                {materials.map((material) => (
                    <div
                        key={material} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="material"
                            value={material}
                            onChange={handleFilterChange}
                            checked={filters.material.includes(material)}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{material}</span>
                    </div>
                ))}
            </div>

            {/* Brand Filer */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Brand</label>
                {brands.map((brand) => (
                    <div
                        key={brand} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="brand"
                            value={brand}
                            onChange={handleFilterChange}
                            checked={filters.brand.includes(brand)}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{brand}</span>
                    </div>
                ))}
            </div>

            {/* !!!!! change the slider to accept min values as well*/}
            {/* Price Range */}
            <div className="mb-8">
                <label className="block text-gray-600 font-medium mb-2">Price Range</label>
                <input
                    type="range"
                    name="priceRange"
                    min={0}
                    max={100}
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    )
}
export default FilterSidebar

// include in CollectionPage.jsx
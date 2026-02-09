export class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "limit", "search", "sort", "fields"];
        excludedFields.forEach((field) => delete queryObj[field]);

        // Advanced filtering: gte, gt, lte, lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search(fields) {
        if (this.queryString.search) {
            const searchQuery = {
                $or: fields.map((field) => ({
                    [field]: { $regex: this.queryString.search, $options: "i" },
                })),
            };
            this.query = this.query.find(searchQuery);
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt"); // Default: newest first
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v"); // Exclude __v by default
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        
        // Store pagination info for response
        this.paginationInfo = {
            page,
            limit,
            skip,
        };
        
        return this;
    }

    async execute() {
        const results = await this.query;
        return results;
    }

    async executeWithCount(model) {
        // Get total count for pagination
        const totalDocs = await model.countDocuments(this.query.getFilter());
        const results = await this.query;

        return {
            results,
            pagination: {
                ...this.paginationInfo,
                total: totalDocs,
                totalPages: Math.ceil(totalDocs / this.paginationInfo.limit),
            },
        };
    }
}
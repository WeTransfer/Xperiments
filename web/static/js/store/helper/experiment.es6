export default {
  id: null,
  name: "",
  description: "...",
  start_date: +new Date(), // now
  end_date: null,
  allocated_percentage: 100,
  rules: [
    // {parameter: "language", type: "string", operator: "==", value: "en"},
    // {parameter: "country"m type: "string", operator: "==", value: "us"}
  ],
  variants: [
    // {
    //   name: "original",
    //   control_group: true,
    //   payload: null,
    //   allocated_percentage: 50
    // },
    // {
    //   name: "variantA",
    //   control_group: false,
    //   payload: {
    //     plus: {
    //       content: {
    //         header: {
    //           title: "WeTransfer Plus",
    //           subTitle: "Get more out of WeTransfer, get Plus"
    //         }
    //       }
    //     }
    //   },
    //   allocated_percentage: 25
    // },
    // {
    //   name: "variantB",
    //   control_group: false,
    //   payload: {
    //     plus: {
    //       content: {
    //         header: {
    //           title: "Some other heading",
    //           subTitle: "Some other sub title"
    //         }
    //       }
    //     }
    //   },
    //   allocated_percentage: 25
    // }
  ]
};
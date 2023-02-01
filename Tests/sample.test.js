const myBeverage = {
   delicious:true,
   sour: false
};

describe("ExploreJestDescribe",() => {
   test("is delicious",() => {
      expect(myBeverage.delicious).toBeTruthy();
   })

   test("is not sour",() => {
      expect(myBeverage.sour).toBeFalsy();
   });
});

describe.each([
   [1,1,2],
   [1,2,3],
   [2,1,3]
])('.add(%i,%i)',(a,b,expected) => {
   test(`returns ${expected}`,() => {
      expect(a+b).toBe(expected);
   });
   test(`returned value not to be greater than ${expected}`,() => {
      expect(a+b).not.toBeGreaterThan(expected);
   })
   test(`returned value not to be less than ${expected}`,() => {
      expect(a+b).not.toBeLessThan(expected);
   })
});
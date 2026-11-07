#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    bool possible = a < b + c && b < a + c && c < a + b;
    if (!possible) {
        cout << "IMPOSSIBLE\n";
    } else if (a == b && b == c) {
        cout << "EQUILATERAL\n";
    } else if (a == b || b == c || a == c) {
        cout << "ISOCELE\n";
    } else {
        cout << "QUELCONQUE\n";
    }
    return 0;
}

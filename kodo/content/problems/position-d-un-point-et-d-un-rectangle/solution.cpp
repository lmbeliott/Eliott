#include <iostream>
using namespace std;

int main() {
    int x1, y1, x2, y2, x, y;
    cin >> x1 >> y1 >> x2 >> y2 >> x >> y;
    bool dedans_large = x1 <= x && x <= x2 && y1 <= y && y <= y2;
    bool dedans_strict = x1 < x && x < x2 && y1 < y && y < y2;
    if (dedans_strict) {
        cout << "DEDANS\n";
    } else if (dedans_large) {
        cout << "BORD\n";
    } else {
        cout << "DEHORS\n";
    }
    return 0;
}

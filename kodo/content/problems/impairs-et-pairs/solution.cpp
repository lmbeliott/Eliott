#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int impairs = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        // x % 2 vaut 1 si x est impair, 0 s'il est pair.
        impairs = impairs + x % 2;
    }
    cout << impairs << "\n";
    cout << n - impairs << "\n";
    return 0;
}

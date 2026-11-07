#include <iostream>
using namespace std;

int main() {
    int billes = 0;
    for (int n = 1; n <= 10; n++) {
        // Add row number n, which contains n marbles.
        billes = billes + n;
        cout << n << " " << billes << "\n";
    }
    return 0;
}

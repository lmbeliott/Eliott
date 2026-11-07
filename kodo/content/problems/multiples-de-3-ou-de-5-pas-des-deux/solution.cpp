#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int compte = 0;
    for (int k = 1; k <= n; k++) {
        bool par3 = k % 3 == 0;
        bool par5 = k % 5 == 0;
        // Exactement un des deux est vrai : les deux booléens sont différents.
        if (par3 != par5) {
            compte = compte + 1;
        }
    }
    cout << compte << "\n";
    return 0;
}

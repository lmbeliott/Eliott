#include <iostream>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    int nombre = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {   // j > i : chaque paire une seule fois
            if ((i + j) % k == 0) {
                nombre = nombre + 1;
            }
        }
    }
    cout << nombre << "\n";
    return 0;
}

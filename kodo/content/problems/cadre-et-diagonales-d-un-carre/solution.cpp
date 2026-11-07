#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            bool bord = i == 0 || i == n - 1 || j == 0 || j == n - 1;
            bool diagonale = i == j || i + j == n - 1;
            if (bord || diagonale) {
                cout << "#";
            } else {
                cout << ".";
            }
        }
        cout << "\n";
    }
    return 0;
}

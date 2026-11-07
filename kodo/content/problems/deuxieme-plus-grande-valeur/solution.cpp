#include <iostream>
using namespace std;

int main() {
    int n, a, b;
    cin >> n >> a >> b;
    // premier >= second : les deux plus grandes valeurs vues jusqu'ici.
    int premier, second;
    if (a >= b) {
        premier = a;
        second = b;
    } else {
        premier = b;
        second = a;
    }
    for (int i = 0; i < n - 2; i++) {
        int x;
        cin >> x;
        if (x > premier) {
            second = premier;
            premier = x;
        } else if (x > second) {
            second = x;
        }
    }
    cout << second << "\n";
    return 0;
}
